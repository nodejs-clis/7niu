/**
 * 文件描述
 * @author ydr.me
 * @create 2015-03-11 18:15
 */

'use strict';

var mime = require('ydr-utils').mime;
var request = require('ydr-utils').request;
var path = require('ydr-utils').path;
var qiniu = require('ydr-utils').qiniu;
var log = require('./log.js');
var fs = require('fs');
var FormData = require('form-data');
var uploadURL = 'http://up.qiniu.com';


/**
 * 上传文件
 * @param dir {String} 执行路径
 * @param options {Object} 配置
 * @param file {String} 待上传文件的绝对路径
 * @param callback {Function} 上传完毕回调
 */
module.exports = function upload(dir, options, file, callback) {
    // 文件的根目录
    var absDir = path.join(dir, options.src);
    var relativePath = path.relative(absDir, file);
    // 文件存放路径
    var putDir = path.dirname(path.join(options.dest, relativePath));
    var extname = path.extname(file);
    var fd = new FormData();
    var uploadKeyAndToken = qiniu.generateKeyAndToken({
        bucket: options.bucket,
        dirname: path.toURI(putDir),
        filename: path.toURI(path.basename(file)),
        accessKey: options.access_key,
        secretKey: options.secret_key,
        mimeLimit: '*'
    });

    fd.append('key', uploadKeyAndToken.key);
    fd.append('token', uploadKeyAndToken.token);
    fd.append('file', fs.createReadStream(file), {
        contentType: mime.get(extname, options.contentType)
    });

    request.post({
        url: uploadURL,
        form: fd,
        timeout: 3000000
    }, function (err, body, res) {
        if (err) {
            log('upload file', file, 'error');
            log('upload file', err.message, 'error');
            return callback(err);
        }

        if (res.statusCode === 200) {
            return callback();
        }

        console.log(body);
        console.log(res.headers);
    });
};

