const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const sass = require('gulp-sass')
const watch = require('gulp-watch')
const autoprefixer = require('gulp-autoprefixer')
const sassGrapher = require('gulp-sass-grapher')
const debug = require('gulp-debug')
const rename = require('gulp-rename')
// 错误处理，防止失败编译失败之后就gulp进程就挂掉
const plumber = require('gulp-plumber')
// const base64 = require('gulp-css-base64')
const base64 = require('gulp-base64')
const babel = require('gulp-babel')
const uglifyJs = require('gulp-uglify')
const tiny = require('gulp-tinypng-nokey-plus')
const jsonminify = require('gulp-jsonminify2')
const gulpif = require('gulp-if')
const through = require('through2')
const gulpUtil = require('gulp-util')
const eslint = require('gulp-eslint')
const stylelint = require('gulp-stylelint')
const rimraf = require('gulp-rimraf')
const requireModules = require('./gulp-require-modules-custom')
const svgmin = require('gulp-svgmin')
const wxsmin = require('gulp-wxsmin')

const importWxss = require('./utils/importWxss')

const SRC_PATH = path.resolve(__dirname, '../src')
const DIST_PATH = path.resolve(__dirname, '../dist')
/** 将多个gulp管道任务以数组的形式结合起来 */
// const pump = require('pump')
const scssPattern = ['src/**/*.scss', 'src/**/*.wxss']
const getCopyPattern = () => {
    return ['md', 'json'].map(item => `src/**/*.${item}`)
}
const getMedioPattern = () => {
    return ['svg', 'png', 'gif', 'jpg', 'jpeg'].map(item => `src/**/*.${item}`).concat([`!**/assets/base64_images/**/*`, `!**/assets/base64_images/*`])
}

const loadPaths = path.resolve(SRC_PATH)
sassGrapher.init(SRC_PATH, { loadPaths: loadPaths })

function getSassTasks (isWatch, isMinify) {
    return (isWatch ? watch : gulp.src)(scssPattern, {}, function (e) {
        if (e.event === 'unlink') {
            fs.unlinkSync(e.history.pop())
        }
    })
        .pipe(plumber())
    // .pipe(sassGrapher.ancestors())
        .pipe(sass({
            includePath: loadPaths,
            outputStyle: isMinify ? 'compressed' : 'nested'
        }))
        .pipe(plumber.stop())
        .pipe(autoprefixer({
            browsers: ['Chrome > 0']
        }))
        .pipe(rename({
            extname: '.wxss'
        }))
        .pipe(debug({
            title: '编译:'
        }))
        .pipe(base64({
            exclude: [/^(http|\/\/)/],
            maxImageSize: 10 * 1024
        }))
        .pipe(importWxss())
        .pipe(gulp.dest(DIST_PATH))
}

function getWxmlTasks (isWatch, isMinify) {
    let res = (isWatch ? watch : gulp.src)(['src/**/*.wxml'], {}, (e) => {
        if (e.event === 'unlink') {
            fs.unlinkSync(e.history.pop())
        }
    })
        .pipe(debug({
            title: '编译:'
        }))
    if (isMinify) {
        res = res
            .pipe((function () {
                return through.obj(function (file, enc, cb) {
                    // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
                    if (file.isNull()) {
                        this.push(file)
                        return cb()
                    }
    
                    // 插件不支持对 Stream 对直接操作，跑出异常
                    if (file.isStream()) {
                        this.emit('error', new gulpUtil.PluginError('PLUGIN_NAME', 'Streaming not supported'))
                        return cb()
                    }
                    // 将文件内容转成字符串
                    let content = file.contents.toString()
                        .replace(/[\r\n]/g, '')
                        .replace(/\s{1,}/g, ' ')
                        .replace(/\>\s/g, '>')
                        .replace(/\<\s/g, '<')
                        .replace(/\s\/\>/g, '/>')
                        .replace(/\s\>/g, '>')
                        .replace(/\s\?\s/g, '?')
                        .replace(/\s\:\s/g, ':')
                        // .replace(/\{\{\s/g, '{{')
                        // .replace(/\}\}\s/g, '}}')
                    // 然后将处理后的字符串，再转成Buffer形式
                    file.contents = Buffer.from(content)
    
                    // 下面这两句基本是标配啦，可以参考下 through2 的API
                    this.push(file)
    
                    cb()
                })
            })()
        )
    }
    return res.pipe(gulp.dest(DIST_PATH))
}

function getImagesTasks (isWatch, isMinify) {
    let res = (isWatch ? watch : gulp.src)(getMedioPattern(), {}, (e) => {
        if (e.event === 'unlink') {
            fs.unlinkSync(e.history.pop())
        }
    })
    .pipe(debug({
        title: '编译:'
    }))

    if (isMinify) {
        res = res
            .pipe(gulpif('**/*.svg', svgmin()))
            .pipe(gulpif('!**/*.svg', tiny()))
    }
    return res.pipe(gulp.dest(DIST_PATH))
}

function getCopyTasks (isWatch, isMinify) {
    let res = (isWatch ? watch : gulp.src)(getCopyPattern(), { }, (e) => {
        if (e.event === 'unlink') {
            fs.unlinkSync(e.history.pop())
        }
    })
        .pipe(debug({
            title: '编译:'
        }))
  
    if (isMinify) {
        res = res.pipe(gulpif('**/*.json', jsonminify()))
    }

    return res.pipe(gulp.dest(DIST_PATH))
}

function getJsTasks (isWatch, isMinify) {

    let res = (isWatch ? watch : gulp.src)(['src/**/*.js', 'src/**/*.wxs'], {}, (e) => {
        if (e.event === 'unlink') {
            fs.unlinkSync(e.history.pop())
        }
    })
        .pipe(debug({
            title: '编译:'
        }))
        .pipe(gulpif(['**/plugin/**/*', '!**/runtime.js', '!**/*.wxs'], (function () {
            return through.obj(function (file, enc, cb) {
                // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
                if (file.isNull()) {
                    this.push(file)
                    return cb()
                }

                // 插件不支持对 Stream 对直接操作，跑出异常
                if (file.isStream()) {
                    this.emit('error', new gulpUtil.PluginError('PLUGIN_NAME', 'Streaming not supported'))
                    return cb()
                }
                // 将文件内容转成字符串
                let content = `import regeneratorRuntime from '@utils/npm/runtime';\n` + file.contents.toString()

                // 然后将处理后的字符串，再转成Buffer形式
                file.contents = Buffer.from(content)

                // 下面这两句基本是标配啦，可以参考下 through2 的API
                this.push(file)

                cb()
            })
        })()))
        .pipe(
            gulpif('**/*.wxs', rename({
                extname: '.wxs.js'
            }))
        )
        .pipe(requireModules({
          modulesDirectory: 'dist/plugin/npm',
          modulesManifestPath: 'dist/plugin/npm/require-modules.json',
          dist: true,
          distDirectory: 'dist/plugin',
          fromDirectory: 'src/plugin'
        }))
        .pipe(babel())
    

    if (isMinify) {
        res = res.pipe(
            gulpif('!**/*.wxs.js', uglifyJs())
        )
        .pipe(
            gulpif('**/*.wxs.js', wxsmin())
        )
    }

    return res
        .pipe(
            gulpif('**/*.wxs.js', rename(path => {
                path.basename = path.basename.replace('.wxs', '')
                path.extname = '.wxs'
            }))
        )
        .pipe(gulp.dest(DIST_PATH))
}

gulp.task('rimraf', function () {
    gulp.src(path.resolve(process.cwd(), './dist/*'), { read: false })
        .pipe(rimraf())
})

gulp.task('eslint', function () {
    return gulp.src(['src/plugin/**/*.js', '!**/runtime.js', 'src/plugin/**/*.wxs'])
        .pipe(eslint())
        .pipe(eslint.format())
        // .pipe(eslint.failAfterError())
})

gulp.task('lintScss', function () {
    return gulp.src('src/plugins/**/*.scss')
        .pipe(stylelint(
            {
                // failAfterError: true,
                debug: false,
                reporters: [
                    {
                        formatter: 'string',
                        console: true
                    }
                ]
            }
        ))
})

gulp.task('sass', function () {
    return getSassTasks()
})

gulp.task('wxml', () => {
    return getWxmlTasks()
})

gulp.task('images', () => {
    return getImagesTasks()
})

gulp.task('copy', () => {
    return getCopyTasks()
})

gulp.task('js', () => {
    return getJsTasks()
})

gulp.task('sass-minify', function () {
    return getSassTasks(false, true)
})

gulp.task('wxml-minify', () => {
    return getWxmlTasks(false, true)
})

gulp.task('images-minify', () => {
    return getImagesTasks(false, true)
})

gulp.task('js-minify', () => {
    return getJsTasks(false, true)
})

gulp.task('copy-minify', () => {
    return getCopyTasks(false, true)
})

gulp.task('watch', () => {
    gulp.watch(['src/plugin/**/*.js', '!**/runtime.js', 'src/plugin/**/*.wxs'], ['eslint'])
    gulp.watch(['src/plugin/**/*.scss'], ['lintScss'])
    getWxmlTasks(true)
    getImagesTasks(true)
    getSassTasks(true)
    getCopyTasks(true)
    getJsTasks(true)
})

module.exports = [
    [
        'eslint',
        'lintScss',
        'sass', 
        'wxml',
        'copy', 
        'js',
        'images',
        'watch'
    ],
    [
        'wxml-minify',
        'sass-minify',
        'copy-minify', 
        'js-minify',
        'images-minify'
    ],
    'rimraf'
]
