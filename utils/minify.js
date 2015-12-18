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
var dato = require('ydr-utils').dato;

var zhitu = function (file, options, callback) {
    var url = 'http://zhitu.isux.us/index.php/preview/upload_file';
    var defaults = {
        // 压缩程度：10-95
        compress: 70,
        destname: ''
    };
    var args = allocation.args(arguments);

    if (typeis.Function(args[1])) {
        callback = args[1];
        options = null;
    }

    options = dato.extend({}, defaults, options);
    var fd = new FormData();

    fd.append('mame', path.basename(file));
    fd.append('compress', '70');
    fd.append('type', path.extname(file).slice(1));
    fd.append('fileSelect', fse.createReadStream(file));

    howdo
    // 上传
        .task(function (next) {
            request.post({
                url: url,
                form: fd
            }, next);
        })
        // 下载
        .task(function (next) {

        })
        .follow(callback);
};

