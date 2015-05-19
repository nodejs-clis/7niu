/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-03-11 18:15
 */

'use strict';

var mime = require('ydr-utils').mime;
var request = require('ydr-utils').request;
var typeis = require('ydr-utils').typeis;
var dato = require('ydr-utils').dato;
var token = require('./token.js');
var log = require('./log.js');
var fs = require('fs');
var path = require('path');
var FormData = require('form-data');
var uploadURL = 'http://up.qiniu.com';
var REG_TITLE = /<title>([\s\S]*?)<\/title>/;


/**
 * 上传文件
 * @param dir {String} 执行路径
 * @param options {Object} 配置
 * @param file {String} 待上传文件的绝对路径
 * @param callback {Function} 上传完毕回调
 */
module.exports = function upload(dir, options, file, callback) {
    // 目标路径
    dir = path.join(dir, options.src);

    var extname = path.extname(file);
    var headers = {
        'content-type': mime.get(extname)
    };
    var fd = new FormData();

    fd.append('key', token.generate({
        bucket: options.bucket,
        dirname: dir
    }, options.access_key, options.secret_key));
    fd.append('my_buffer', new Buffer(10));
    fd.append('file', fs.createReadStream(file));
    dato.extend(headers, options.headers);
    request.put({
        url: uploadURL,
        form: fd
    }, function (err, body, res) {
        if (err) {
            log('upload file', file, 'error');
            log('upload file', err.message, 'error');
            return process.exit();
        }

        if (res.statusCode === 200) {
            return callback();
        }

        console.log(body);
        console.log(res.headers);
    });
};

