const gulp = require('gulp');
// const Rename = require('gulp-rename');          // 重命名
// js
const Uglify = require('gulp-uglify');          // 压缩js
// const Babel = require('gulp-babel');
// css
const Minifycss = require('gulp-minify-css');   // 压缩css
const Less = require('gulp-less');              // 编译less
const Autoprefixer = require('gulp-autoprefixer');  // 浏览器前缀
// html
const MinifyHtml = require("gulp-minify-html"); //压缩html
const FileInclude = require('gulp-file-include'); // 文件模块化
// image
const Imagemin = require('gulp-imagemin');
const Pngquant = require('imagemin-pngquant');  //png图片压缩插件
const Cache = require('gulp-cache'); 

const Clean = require('gulp-clean');            // 清理目录

// md5 发版本的时候为了避免浏览器读取了旧的缓存文件，需要为其添加md5戳
const md5 = require("gulp-md5-plus");

const config = require('./config');
const { dist } = config;
// html
async function html() {
    return gulp.src('src/views/*.html')
        .pipe(FileInclude({ // HTML模板替换，具体用法见下文
            prefix: '##',
            basepath: '@file'
        }))
        // .pipe(MinifyHtml())
        .on('error', function(err) {
            console.error('Task:copy-html,', err.message);
            this.end();
        })
        .pipe(gulp.dest(dist)) // 拷贝 
}

// css
async function css() {
    return await gulp.src('src/css/**')
    .pipe(Less())       //编译less
    .pipe(Autoprefixer({
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove: true //是否去掉不必要的前缀 默认：true
    }))
    .pipe(Minifycss({   // 压缩css
        //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
        advanced: true,
        //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
        compatibility: '',
        //类型：Boolean 默认：false [是否保留换行]
        keepBreaks: false,
        //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀        
        keepSpecialComments: '*'
    }))
    .pipe(gulp.dest(dist + '/css'))
    .pipe(md5(10, dist + '/*.html', {
        mappingFile: 'manifest.json',
        connector: '.' // 文件名和hash的连接符
    }))
    .pipe(gulp.dest(dist + '/css')) //当前对应css文件
}

// js
async function js() {
    return await gulp.src('src/js/**')
    // .pipe(Babel({
    //     presets: ['es2015']
    // }))
    .pipe(Uglify()) // 压缩js
    .pipe(gulp.dest(dist + '/js'))
    .pipe(md5(10, dist + '/*.html', {
        mappingFile: 'manifest.json',
        connector: '.'
    }))
    .pipe(gulp.dest(dist + '/js')) // 拷贝
}

// image
async function image() {
    return await gulp.src('src/images/*')
    .pipe(Cache(Imagemin({
        optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [Pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    })))
    .pipe(gulp.dest(dist + '/images'));
}


// clean dir
async function clean() {
    // 不设置allowEmpty: true会报File not found with singular glob
    return await gulp.src(dist, {allowEmpty: true}).pipe(Clean());
}



module.exports = {
    html,
    css,
    js,
    image,
    clean
}