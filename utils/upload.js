/**
 * upload a file
 * @author ydr.me
 * @create 2015-03-11 18:15
 */

'use strict';

var fs = require('fs');
var FormData = require('form-data');

var mime = require('ydr-utils').mime;
var request = require('ydr-utils').request;
var path = require('ydr-utils').path;
var qiniu = require('ydr-utils').qiniu;
var typeis = require('ydr-utils').typeis;
var imageMinify = require('ydr-utils').imageMinify;

var uploadURL = 'http://up.qiniu.com';


/**
 * upload a file
 * @param file {String} 待上传文件的绝对路径
 * @param options {Object} 配置
 * @param options.srcDirname {String} 起始目录
 * @param options.destDirname {String} 目标目录
 * @param options.image {Object} 目标目录
 * @param options.image.processor {String} 图片处理器
 * @param options.image.minify {Boolean} 是否压缩图片
 * @param options.image.quality {Number} 图片质量
 * @param callback {Function} 上传回调
 * @returns {string}
 */
module.exports = function (file, options, callback) {
    callback = typeis.function(callback) ? callback : function () {
        // ignore
    };

    var stream = fs.createReadStream(file);
    var extname = path.extname(file).slice(1);
    var upload = function (stream) {
        var relativePath = path.relative(options.srcDirname, file);
        var destExtname = path.extname(file);
        var sign = qiniu.signature(relativePath);
        var fd = new FormData();

        fd.append('key', sign.key);
        fd.append('token', sign.token);
        fd.append('file', stream, {
            contentType: mime.get(destExtname)
        });

        request.post({
            url: uploadURL,
            form: fd,
            timeout: -1
        }, function (err, body, res) {
            if (err) {
                err.file = file;
                return callback(err, body);
            }

            if (res.statusCode === 200) {
                return callback(null, body);
            }

            var json;

            try {
                json = JSON.parse(body);
            } catch (err) {
                json = {
                    error: 'parse upload response error'
                }
            }

            err = new Error(json.error);
            err.file = file;
            callback(err);
        });
    };

    if (options.image && options.image.minify) {
        switch (options.image.processor) {
            case 'zhitu':
                if (imageMinify.zhitu[extname]) {
                    imageMinify.zhitu(stream, {
                        filename: path.basename(file),
                        quality: options.image.quality
                    }, function (err, stream) {
                        upload(stream);
                    });
                } else {
                    upload(stream);
                }
                break;

            default:
                upload(stream);
        }
    } else {
        upload(stream);
    }
};
