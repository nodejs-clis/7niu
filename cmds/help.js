/**
 * show help information
 * @author ydr.me
 * @create 2015-11-07 09:54
 */


'use strict';

var debug = require('ydr-utils').debug;

var banner = require('./banner.js');

module.exports = function () {
    var options = {
        eventAlign: 'left',
        eventLength: 25
    };

    banner();
    console.log('1. Command');
    debug.success('   upload', 'upload files to qiniu', options);
    debug.success('   init', 'initial `7niu.json`', options);
    debug.success('   clear', 'clear upload cache', options);
    debug.success('   version', 'show version information', options);
    debug.success('   help', 'show help information', options);
    console.log();

    console.log('2. Options');
    debug.success('   -d --dirname', 'specified a directory', options);
    //debug.success('   -j --coolie.js', 'initial configuration file of `coolie.js`', options);
    //debug.success('   -c --"coolie cli"', 'initial configuration file of `coolie cli`', options);
    //debug.success('   -n --node', 'create a node sample', options);
    //debug.success('   -s --static', 'create a static sample', options);
    console.log();
};



