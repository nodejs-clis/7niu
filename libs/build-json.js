/*!
 * 生成配置文件
 * @author ydr.me
 * @create 2015-03-11 18:16
 */

'use strict';

var log = require('./log.js');
var path = require('path');
var fs = require('fs-extra');
var json = {
    access_key: 'your_access_key',
    secret_key: 'your_secret_key',
    bucket: 'your_bucket',
    src: './',
    upload: ['./**/*.*'],
    dest: '/test/',
    // 并行数量
    parallel: 10,
    contentType: 'application/octect-stream'
};

module.exports = function (dir) {
    var file = path.join(dir, './alioss.json');
    fs.writeFile(file, JSON.stringify(json, null, 2), function (err) {
        if(err){
            log('write file', file, 'error');
            log('write file', err.message, 'error');
            return process.exit();
        }

        log('write file', file, 'success');
    });
};



