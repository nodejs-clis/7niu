/*!
 * 上传日志文件缓存
 * @author ydr.me
 * @create 2015-10-08 16:42
 */


'use strict';

var fs = require('fs');
var log = require('log');
var path = require('ydr-utils').path;
var typeis = require('ydr-utils').typeis;
var encryption = require('ydr-utils').encryption;

var REG_LINE = /\n/g;
var REG_EQUAL = /\t/g;


module.exports = function (files, options) {
    var cache = '';

    if (typeis.file(options.cacheFile)) {
        try {
            cache = fs.readFileSync(options.cacheFile, 'utf8');
        } catch (err) {
            log('read file', path.toSystem(options.cacheFile), 'error');
            log('read file', err.message, 'error');
            process.exit(1);
        }
    }

    var cacheList = cache.split(REG_LINE);
    var cacheMap = {};

    if (cacheList && cacheList[0]) {
        cacheList.forEach(function (item) {
            var temp = item.split(REG_EQUAL);

            cacheMap[temp[0]] = temp[1];
        });
    }

    console.log(cacheMap);

    return files;
};

