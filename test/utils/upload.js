/**
 * 文件描述
 * @author ydr.me
 * @create 2015-11-07 14:20
 */


'use strict';

var assert = require('assert');
var path = require('ydr-utils').path;

var upload = require('../../utils/upload.js');

var srcDirname = path.join(__dirname, '../../_test/');
var textFile = path.join(srcDirname, '1.txt');

describe('utils/upload.js', function () {
    it('e', function (done) {
        upload(textFile, {
            srcDirname: srcDirname,
            accessKey: 'x',
            secretKey: 'y',
            bucket: 'static',
            destDirname: '_test'
        }, function () {
            done();
        });
    });
});



