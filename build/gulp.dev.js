const gulp = require('gulp');
// js
const Jshint = require("gulp-jshint");          //js检查
const Gutil = require('gulp-util');
const Proxy = require('http-proxy-middleware');
// const Webpack = require('webpack');
// const WebpackConfig = require('./webpack.config.js');

// css
const Less = require('gulp-less');              // 编译less

// html
const FileInclude = require('gulp-file-include'); // 文件模块化

// server
const Connect = require('gulp-connect');        //引入gulp-connect模块 

const Clean = require('gulp-clean');            // 清理目录

// 配置文件
const config = require('./config');
const { dist } = config;

// html
async function html() {
    return gulp.src('src/views/*.html')
        .pipe(FileInclude({ // HTML模板替换，具体用法见下文
            prefix: '##',
            basepath: '@file'
        })).on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist)) // 拷贝 
        .pipe(Connect.reload())
}

// css
async function css() {
    return await gulp.src('src/css/*.less')
    .pipe(Less())       //编译less
    .pipe(gulp.dest(dist + '/css')) //当前对应css文件
    .pipe(Connect.reload());//更新
}

// js
// const compilerJS = Webpack(WebpackConfig);

async function js() {
    return await gulp.src('src/js/**')
    .pipe(Jshint())//检查代码
    // .pipe(Babel({
    //     presets: ['es2015']
    // }))
    .on('error', function(err) {
        Gutil.log(Gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest(dist + '/js')) // 拷贝
    .pipe(Connect.reload()); //更新
    
    // 使用es6+可以单独配置
    // compilerJS.run(function(err, stats) {
    //     if(err) throw new Gutil.PluginError("webpack:js", err);
    //     Gutil.log("[webpack]", stats.toString({
    //         colors: true
    //     }));
    //     cb()
    // });
}

// image
async function image() {
    return await gulp.src('src/images/*')
    .pipe(gulp.dest(dist + '/images'));
}

// clean dir
async function clean() {
    // 不设置allowEmpty: true会报File not found with singular glob
    return await gulp.src(dist, {allowEmpty: true}).pipe(Clean());
}

// 服务器函数
async function server() {
    Connect.server({
        root:dist, //根目录
        // ip:'192.168.11.62',//默认localhost:8080
        livereload:true, //自动更新
        port:9909, //端口
        middleware: function(connect, opt) {
            return [
                Proxy('/api', {
                    target: 'http://localhost:8080',
                    changeOrigin:true
                }),
                Proxy('/otherServer', {
                    target: 'http://IP:Port',
                    changeOrigin:true
                })
            ]
        }
    })
}

module.exports = {
    html,
    css,
    js,
    image,
    clean,
    server
}