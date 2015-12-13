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

var uploadURL = 'http://up.qiniu.com';
var REG_START_END = /^\/|\/$/;


/**
 * upload a file
 * @param file {String} 待上传文件的绝对路径
 * @param options {Object} 配置
 * @param options.srcDirname {String} 起始目录
 * @param options.destDirname {String} 目标目录
 * @param callback {Function} 上传回调
 * @returns {string}
 */
module.exports = function (file, options, callback) {
    callback = typeis.function(callback) ? callback : function () {
        // ignore
    };

    options.destDirname = path.toURI(options.destDirname);
    options.destDirname = options.destDirname.replace(REG_START_END, '');
    options.destDirname = '/' + options.destDirname + '/';

    var relativePath = path.relative(options.srcDirname, file);
    var destExtname = path.extname(file);
    var uploadKeyAndToken = qiniu.signature(relativePath);
    var fd = new FormData();

    fd.append('key', uploadKeyAndToken.key);
    fd.append('token', uploadKeyAndToken.token);
    fd.append('file', fs.createReadStream(file), {
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
