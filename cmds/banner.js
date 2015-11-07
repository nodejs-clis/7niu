/**
 * show banner
 * @author ydr.me
 * @create 2015-10-31 20:35
 */



'use strict';

var string = require('ydr-utils').string;

var pkg = require('../package.json');

module.exports = function () {
    console.log();
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║  ', pkg.name + '@' + string.padRight(pkg.version, 8, ' '), '                                   ║');
    console.log('║  ', pkg.description, '                ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log();
};
