# 7niu

[![Build Status][travis-img]][travis-url] 

七牛云存储命令行。


## install
```
npm install -g 7niu
```


## api
```
╔══════════════════════════════════════════════════════╗
║   7niu@2.3.0                                         ║
║   qiniu cloud command line                           ║
╚══════════════════════════════════════════════════════╝

1. Command
   upload                 >> upload files to qiniu
   init                   >> initial `7niu.json`
   clear                  >> clear upload cache
   version                >> show version information
   help                   >> show help information

2. Options
   -d --dirname           >> specified a directory
```


## 7niu.json
```
{
    "access_key": "your_access_key",
    "secret_key": "your_secret_key",

    // 仓库
    "bucket": "your_bucket",

    // 待上传资源的源目录，相当于`7niu.json`所在的目录
    "src": "./",

    // 上传的文件列表，支持通配符，相对于 src
    "upload": [
        "./**"
    ],

    // 上传的 CDN 目录
    "dest": "/test/",

    // 并行上传数量，默认10
    "parallel": 10
}
```

## example
假设当前的资源目录是这样的：
```
- static
|-- js
|   `-- app
|       |-- abc.js
|       `-- def.js
|-- css
`-- 7niu.json
```
要上传的资源为`./static/js/app/*`，线上的 CDN URL 为`/example.com/abc.js`。
```
{
    ...
    upload: [
        './**/*'
    ],
    src: './static/js/app/',
    dest: '/example.com/'
}
```

## version
### 2.x
- 更好的命令行接口
- 更好的版本控制

### 1.x
- 实现基本上传功能



[travis-img]: https://travis-ci.org/cloudcome/nodejs-7niu.svg?branch=master
[travis-url]: https://travis-ci.org/cloudcome/nodejs-7niu