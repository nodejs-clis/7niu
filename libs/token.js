/*!
 * 生成七牛前端上传凭证
 * @author ydr.me
 * @create 2015-01-12 14:19
 */

'use strict';

// 详细文档：http://developer.qiniu.com/docs/v6/api/reference/security/put-policy.html
var defaults = {
    ////指定上传的目标资源空间（Bucket）和资源名（Key）
    ////有两种格式：
    ////1. <bucket>，表示允许用户上传文件到指定的 bucket。在这种模式下文件只能“新增”，若已存在同名资源则会失败；
    ////2. <bucket>:<key>，表示只允许用户上传指定key的文件。在这种模型下文件默认允许“修改”，
    //// 已存在同名资源则会本次覆盖。如果希望只能上传指定key的文件，并且不允许修改，那么可以将下面的 insertOnly 属性值设为 1。
    //scope: udf,
    // 保存仓库
    bucket: '',
    // 路径前缀
    dirname: '',
    // 过期时间，单位：秒
    expires: 3600,
    insertOnly: undefined,
    // 保存的文件名
    saveKey: undefined,
    endUser: undefined,
    returnUrl: undefined,
    returnBody: undefined,
    callbackUrl: undefined,
    callbackHost: undefined,
    callbackBody: undefined,
    persistentOps: undefined,
    persistentNotifyUrl: undefined,
    persistentPipeline: undefined,
    // 文件限制大小，单位：字节
    fsizeLimit: undefined,
    // ● 开启MimeType侦测功能
    // 设为非0值，则忽略上传端传递的文件MimeType信息，使用七牛服务器侦测内容后的判断结果
    // 默认设为0值，如上传端指定了MimeType则直接使用该值，否则按如下顺序侦测MimeType值：
    // 1. 检查文件扩展名；
    // 2. 检查Key扩展名；
    // 3. 侦测内容。
    // 如不能侦测出正确的值，会默认使用 application/octet-stream 。
    detectMime: undefined,
    // ● 限定用户上传的文件类型
    // 指定本字段值，七牛服务器会侦测文件内容以判断MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败返回403状态码
    // ● 示例
    // 1. “image/*“表示只允许上传图片类型；
    // 2. “image/jpeg;image/png”表示只允许上传jpg和png类型的图片；
    // 3. “!application/json;text/plain”表示禁止上传json文本和纯文本（注意最前面的感叹号）。
    mimeLimit: undefined
};
var dato = require('ydr-utils').dato;
var random = require('ydr-utils').random;
var crypto = require('crypto');
var REG_END = /\/$/;


/**
 * 生成上传凭证
 * @param config {Object} 配置
 * @param ak {String} 七牛 AK
 * @param sk {String} 七牛 SK
 * @returns {Object}
 */
exports.generate = function (config, ak, sk) {
    config = dato.extend(true, {}, defaults, config);

    if (config.dirname.length > 1) {
        config.dirname = REG_END.test(config.dirname) ? config.dirname : config.dirname + '/';
    } else {
        config.dirname = '';
    }

    var key = config.dirname + random.guid();

    if (!config.scope) {
        // 文件名
        config.dirname = String(config.dirname).trim();


        //config.saveKey = config.dirname + random.guid();
        config.scope = config.bucket + ':' + key;
        //config.scope = config.bucket;
    }


    config.bucket = undefined;
    config.dirname = undefined;


    // 有效期
    config.deadline = config.expires + Math.floor(Date.now() / 1000);
    config.expires = undefined;

    console.log(config);

    var encoded = urlsafeBase64Encode(JSON.stringify(config));
    var encoded_signed = base64ToUrlSafe(hmacSha1(encoded, sk));

    return {
        key: key,
        token: ak + ':' + encoded_signed + ':' + encoded
    };
};


exports.hmacSha1 = hmacSha1;
exports.urlsafeBase64Encode = urlsafeBase64Encode;
exports.base64ToUrlSafe = base64ToUrlSafe;


function urlsafeBase64Encode(jsonFlags) {
    var encoded = new Buffer(jsonFlags).toString('base64');
    return base64ToUrlSafe(encoded);
}

function base64ToUrlSafe(v) {
    return v.replace(/\//g, '_').replace(/\+/g, '-');
}

function hmacSha1(encodedFlags, secretKey) {
    var hmac = crypto.createHmac('sha1', secretKey);
    hmac.update(encodedFlags);
    return hmac.digest('base64');
}



/*==========================================*/
//function test(){
//    var c = {
//        bucket: 'a'
//    };
//
//    console.log(exports.generate(c, 'b', 'c'));
//}
//test();

