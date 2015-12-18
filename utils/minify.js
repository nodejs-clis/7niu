/**
 * 图片资源压缩
 * @author ydr.me
 * @create 2015-12-18 11:39
 */


'use strict';

var howdo = require('howdo');
var fse = require('fs-extra');
var request = require('ydr-utils').request;
var allocation = require('ydr-utils').allocation;
var typeis = require('ydr-utils').typeis;
var path = require('ydr-utils').path;
var dato = require('ydr-utils').dato;

var zhitu = function (file, options, callback) {
    var url = 'http://zhitu.isux.us/index.php/preview/upload_file';
    var defaults = {
        // 图片质量：0.1 - 1
        quality: 0.7
    };
    var args = allocation.args(arguments);

    if (typeis.Function(args[1])) {
        callback = args[1];
        options = null;
    }

    options = dato.extend({}, defaults, options);
    var fd = new FormData();
    var originalStream = fse.createReadStream(file);

    fd.append('mame', path.basename(file));
    fd.append('compress', options.quality * 100);
    fd.append('type', path.extname(file).slice(1));
    fd.append('fileSelect', originalStream);

    howdo
    // 上传
        .task(function (next) {
            request.post({
                url: url,
                form: fd
            }, next);
        })
        // 下载
        .task(function (next, body, res) {
            if (res.statusCode !== 200) {
                return next(new Error('upload zhitu response statusCode is ' + res.statusCode));
            }

            var json = {};

            try {
                //{ code: 3,
                //output: 'http://zhitu.isux.us/assets/img/imgTest/png_cut/1450407415693-ori.png',
                //output_jpg: 'http://zhitu.isux.us/assets/img/imgTest/png_cut/1450407415693.jpg',
                //size: 269.1,
                //output_webp: 'null' }
                json = JSON.parse(body);
            } catch (err) {
                return next(new Error('parse zhitu response body error'));
            }

            request.down(json.output, function (err, stream, res) {
                if (err) {
                    return next(err);
                }

                if (res.statusCode !== 200) {
                    return next(new Error('download zhitu response statusCode is ' + res.statusCode));
                }

                next(null, stream);
            });
        })
        .follow()
        .try(function (stream) {
            callback(null, stream);
        })
        .catch(function () {
            callback(null, originalStream);
        });
};


/**
 * 资源压缩
 * @param file
 * @param options
 * @param callback
 */
module.exports = function (file, options, callback) {
    if (options.type === 'zhitu') {
        return zhitu(file, options, callback);
    }

    callback(new Error('can not found minify type of ' + options.type));
};

