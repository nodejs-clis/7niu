/*!
 * 文件描述
 * @author ydr.me
 * @create 2015-09-01 19:32
 */


'use strict';

var path = require('ydr-utils').path;
var REG_PATH = path.sep === '/' ? /\\/g : /\//g;


/**
 * 转换为系统格式路径
 * @param p
 * @returns {string|XML|void}
 */
exports.toSystemPath = function (p) {
    return p.replace(REG_PATH, path.sep);
};


/**
 * 路径相对转换
 * @param from
 * @param to
 */
exports.join = function (from, to) {
    from = exports.toSystemPath(from);
    to = exports.toSystemPath(to);

    return path.join(from, to);
};


/**
 * 路径相对转换
 * @param from
 * @param to
 */
exports.relative = function (from, to) {
    from = exports.toSystemPath(from);
    to = exports.toSystemPath(to);

    return path.relative(from, to);
};
