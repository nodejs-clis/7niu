/*!
 * 上传日志文件缓存
 * @author ydr.me
 * @create 2015-10-08 16:42
 */


'use strict';

var fs = require('fs');

var path = require('ydr-utils').path;
var dato = require('ydr-utils').dato;
var typeis = require('ydr-utils').typeis;
var encryption = require('ydr-utils').encryption;

var log = require('./log.js');

var LINE_SEP = '\n';
var EQUAL_SEP = '\t';


module.exports = function (files, options) {
    var cache1 = '';

    if (typeis.file(options.cacheFile)) {
        try {
            cache1 = fs.readFileSync(options.cacheFile, 'utf8');
        } catch (err) {
            log('read file', path.toSystem(options.cacheFile), 'error');
            log('read file', err.message, 'error');
            process.exit(1);
        }
    }

    var cacheList1 = cache1.split(LINE_SEP);
    var cacheMap1 = {};

    if (cacheList1 && cacheList1[0]) {
        cacheList1.forEach(function (item) {
            var temp = item.split(EQUAL_SEP);

            cacheMap1[temp[0]] = temp[1];
        });
    }

    var cacheMap2 = {};
    var files2 = [];

    files.forEach(function (file) {
        var _cache1 = cacheMap1[file];
        var _cache2 = encryption.etag(file);

        if (_cache1 !== _cache2) {
            files2.push(file);
        }

        cacheMap2[file] = _cache2;
    });

    var cache2List = [];

    dato.each(cacheMap2, function (file, etag) {
        cache2List.push(file + EQUAL_SEP + etag);
    });

    var cache2 = cache2List.join(LINE_SEP);

    try {
        fs.writeFileSync(options.cacheFile, cache2, 'utf8');
    } catch (err) {
        log('write file', path.toSystem(options.cacheFile), 'error');
        log('write file', err.message, 'error');
        process.exit(1);
    }

    return files2;
};

