/**
 * init 7niu.json
 * @author ydr.me
 * @create 2015-11-06 18:19
 */


'use strict';

var fse = require('fs-extra');
var path = require('ydr-utils').path;
var typeis = require('ydr-utils').typeis;
var debug = require('ydr-utils').debug;

var json = {
    access_key: 'your_access_key',
    secret_key: 'your_secret_key',
    bucket: 'your_bucket',
    src: './',
    upload: ['./**'],
    dest: '/test/',
    // 并行数量
    parallel: 10,
    contentType: 'application/octect-stream',
    // 上传前图片压缩
    image: {
        minify: false,
        // http://zhitu.isux.us/
        processor: 'zhitu',
        // 0.1 - 1
        quality: 0.7
    }
};


/**
 * init 7niu.json
 * @param options
 * @returns {*}
 */
module.exports = function (options) {
    var destJSONFile = path.join(options.srcDirname, '7niu.json');

    if (typeis.file(destJSONFile)) {
        debug.error('7niu.json', path.toSystem(destJSONFile) + ' is exist');
        return process.exit(1);
    }

    try {
        fse.outputFileSync(destJSONFile, JSON.stringify(json, null, 4));
        debug.success('7niu.json', path.toSystem(destJSONFile));
    } catch (err) {
        debug.error('7niu.json', path.toSystem(destJSONFile));
        debug.error('write file', err.message);
        return process.exit(1);
    }

    return destJSONFile;
};


