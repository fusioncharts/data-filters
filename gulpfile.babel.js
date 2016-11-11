'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _gulpConcat = require('gulp-concat');

var _gulpConcat2 = _interopRequireDefault(_gulpConcat);

var _gulpMocha = require('gulp-mocha');

var _gulpMocha2 = _interopRequireDefault(_gulpMocha);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _gulpEslint = require('gulp-eslint');

var _gulpEslint2 = _interopRequireDefault(_gulpEslint);

var _child_process = require('child_process');

var _gulpIstanbul = require('gulp-istanbul');

var _gulpIstanbul2 = _interopRequireDefault(_gulpIstanbul);

var _gulpPrettydiff = require('gulp-prettydiff');

var _gulpPrettydiff2 = _interopRequireDefault(_gulpPrettydiff);

var _gulpSourcemaps = require('gulp-sourcemaps');

var _gulpSourcemaps2 = _interopRequireDefault(_gulpSourcemaps);

var _gulpIife = require('gulp-iife');

var _gulpIife2 = _interopRequireDefault(_gulpIife);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import webpackEs5Config from './webpack-es5.config.babel.js';
// import webpackEs6Config from './webpack-es6.config.babel.js';

// import named from 'vinyl-named';
var PATH = {
  allDistJs: 'dist/**/*',
  allSrcJs: 'src/**/*.js',
  allTests: 'test/**/*.js',
  gulpFile: 'gulpfile.babel.js',
  clientEntryPoint: 'src/extension.js',
  webpackEs6File: 'webpack-es6.config.babel.js',
  webpackEs5File: 'webpack-es5.config.babel.js'
};
// import webpack from 'webpack-stream';

// import uglify from 'gulp-uglify';

// import babel from 'gulp-babel';


_gulp2.default.task('lint', function () {
  return _gulp2.default.src([PATH.allSrcJs]).pipe((0, _gulpEslint2.default)()).pipe(_gulpEslint2.default.format()).pipe(_gulpEslint2.default.failAfterError());
});

_gulp2.default.task('test', ['lint'], function () {
  return _gulp2.default.src(PATH.allSrcJs).pipe((0, _gulpIstanbul2.default)()).pipe(_gulpIstanbul2.default.hookRequire()).on('finish', function () {
    _gulp2.default.src(PATH.allTests).pipe((0, _gulpMocha2.default)()).pipe(_gulpIstanbul2.default.writeReports()).pipe(_gulpIstanbul2.default.enforceThresholds({ thresholds: { global: 90 } }));
  });
});

_gulp2.default.task('docs', ['lint'], function () {
  (0, _child_process.exec)('node ./node_modules/.bin/jsdoc -c jsdoc.json', function (error, stdout, stderr) {
    if (error) {
      console.error('exec error: ' + error);
      return;
    }
    console.log('' + stdout);
    console.log('' + stderr);
  });
});

_gulp2.default.task('clean:dist', ['test'], function () {
  return (0, _del2.default)([PATH.allDistJs]);
});

_gulp2.default.task('build-es5', ['clean:dist'], function () {
  return _gulp2.default.src(PATH.allSrcJs).pipe((0, _gulpConcat2.default)('data-filter-es6.min.js')).pipe(_gulpSourcemaps2.default.init({ 'loadMaps': true })).pipe(_through2.default.obj(function (file, enc, cb) {
    var isSourceMap = /\.map$/.test(file.path);
    if (!isSourceMap) {
      this.push(file);
    }
    cb();
  })).pipe(_gulpSourcemaps2.default.write()).pipe((0, _gulpPrettydiff2.default)({
    'lang': 'javascript',
    'mode': 'minify'
  })).pipe(_gulp2.default.dest('dist'));
});

_gulp2.default.task('build', ['clean:dist'], function () {
  return _gulp2.default.src(PATH.allSrcJs).pipe((0, _gulpConcat2.default)('data-filter-es6.min.js')).pipe((0, _gulpIife2.default)({
    useStrict: true,
    prependSemicolon: false,
    params: ['window', 'document', 'undefined'],
    args: ['this', 'document']
  })).pipe(_gulpSourcemaps2.default.init({ 'loadMaps': true })).pipe(_through2.default.obj(function (file, enc, cb) {
    var isSourceMap = /\.map$/.test(file.path);
    if (!isSourceMap) {
      this.push(file);
    }
    cb();
  })).pipe(_gulpSourcemaps2.default.write())
  /*
  .pipe(prettydiff({
    'lang': 'javascript',
    'mode': 'minify'
  }))
  */
  .pipe(_gulp2.default.dest('dist'));
});

_gulp2.default.task('watch', function () {
  return _gulp2.default.watch(PATH.allSrcJs, ['build']);
});

_gulp2.default.task('watch-tests', function () {
  return _gulp2.default.watch(PATH.allTests, ['test']);
});

_gulp2.default.task('default', ['watch-tests', 'watch', 'build']);