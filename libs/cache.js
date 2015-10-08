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


/**
 * 获取缓存
 * @param files {Array}
 * @param options {Object}
 * @returns {{files: *, cacheMapDone: {}, cacheMapAll: {}}}
 */
exports.get = function (files, options) {
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
    var cacheMapDone = {};

    if (cacheList1 && cacheList1[0]) {
        cacheList1.forEach(function (item) {
            var temp = item.split(EQUAL_SEP);

            cacheMapDone[temp[0]] = temp[1];
        });
    }

    var cacheMapAll = {};
    var files2 = [];

    files.forEach(function (file) {
        var _cache1 = cacheMapDone[file];
        var _cache2 = encryption.etag(file);

        if (_cache1 !== _cache2) {
            files2.push(file);
        }

        cacheMapAll[file] = _cache2;
    });


    return {
        files: files2,
        cacheMapDone: cacheMapDone,
        cacheMapAll: cacheMapAll
    };
};


/**
 * 设置缓存
 * @param cacheMap {Object}
 * @param options {Object}
 */
exports.set = function (cacheMap, options) {
    if (!cacheMap) {
        return;
    }

    var cache2List = [];

    dato.each(cacheMap, function (file, etag) {
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
};
