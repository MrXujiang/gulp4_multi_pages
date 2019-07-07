const path = require('path');
const fs = require('fs');

// 获取src目录路径
const srcDir = path.resolve(process.cwd(), 'src');  // process.cwd() 返回运行当前脚本的工作目录的路径

// 生成入口文件的map
function getEntry() {
    let jsPath = path.resolve(srcDir, 'js'),
        fileNames = fs.readdirSync(jsPath),
        matchs = [], 
        files = {};
    fileNames.forEach( item => {
        matchs = item.match(/(.+)\.js$/);
        matchs && (files[matchs[1]] = path.resolve(srcDir, 'js', item));
    });
    console.log(files)
    return files;
}

module.exports = {
    mode: process.env.NODE_ENV === 'dev' ? 'development' : 'production',
    devtool: process.env.NODE_ENV === 'dev' ? 'cheap-eval-source-map' : '',
    entry: getEntry(),
    output: {
        path: path.resolve(process.cwd(), "dist/static/js/"),
        publicPath: "dist/static/js/",
        filename: "[name].js",
        chunkFilename: "[chunkhash].js"
    },
    resolve: {
        alias: {
            _: srcDir + "/js/lib/lodash.js",
        }
    },
    plugins: [
        
    ],
    optimization: {
        splitChunks: {
          // include all types of chunks
          chunks: 'all'
        }
      }
}