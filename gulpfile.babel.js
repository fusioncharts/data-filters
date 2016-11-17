'use strict';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import through from 'through2';
import named from 'vinyl-named';
import eslint from 'gulp-eslint';
import { exec } from 'child_process';
import istanbul from 'gulp-istanbul';
import webpack from 'webpack-stream';
import webpackEs5Config from './webpack-es5.config.babel.js';
import webpackEs6Config from './webpack-es6.config.babel.js';

const PATH = {
  allSrcJs: 'src/**/*.js',
  allTests: 'test/**/*.js',
  clientEntryPoint: 'src/js/index.js',
  gulpFile: 'gulpfile.babel.js',
  webpackEs5File: 'webpack-es5.config.babel.js',
  webpackEs6File: 'webpack-es6.config.babel.js'
};

gulp.task('lint', () =>
  gulp.src([
    PATH.allSrcJs,
    PATH.gulpFile,
    PATH.allTests,
    PATH.webpackEs5File,
    PATH.webpackEs6File
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('test', ['lint'], () =>
  gulp.src(PATH.allSrcJs)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(PATH.allTests)
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
    })
);

gulp.task('docs', ['test'], () => {
  exec('node ./node_modules/.bin/jsdoc -c jsdoc.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  });
});

gulp.task('build-es5', ['docs'], () =>
  gulp.src(PATH.clientEntryPoint)
  .pipe(webpack(webpackEs5Config))
  .pipe(gulp.dest('dist/js'))
);

gulp.task('build-css', ['build-es5'], () =>
  gulp.src('src/css/*.css')
  .pipe(gulp.dest('dist/css'))
);

gulp.task('build', ['build-css'], () =>
  gulp.src(PATH.clientEntryPoint)
  .pipe(named())
  .pipe(webpack(webpackEs6Config))
  .pipe(through.obj(function (file, enc, cb) {
    var isSourceMap = /\.map$/.test(file.path);
    if (!isSourceMap) {
      this.push(file);
    }
    cb();
  }))
  .pipe(gulp.dest('dist/js'))
);

gulp.task('watch', () =>
  gulp.watch(PATH.allSrcJs, ['build'])
);

gulp.task('watch-tests', () =>
  gulp.watch(PATH.allTests, ['test'])
);

gulp.task('default', ['watch-tests', 'watch', 'build']);
