'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    pug = require('gulp-pug'),
    rubySass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    inlineCss = require('gulp-inline-css'),
    inlineSource = require('gulp-inline-source'),
    rename = require('gulp-rename');


gulp.task('styles', function() {
  return rubySass('app/styles/scss/main.scss', {
      sourcemap: false,
      style: 'compressed',
      lineNumbers: true
    })
    .pipe(sourcemaps.write())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./app/styles'))
    .pipe(reload({stream: true}));
});


gulp.task('inline', ['styles', 'pug'], function() {
  return gulp.src('app/*.html')
    .pipe(inlineSource({
      rootpath: 'app'
    }))
    .pipe(inlineCss({
      preserveMediaQueries: true
    }))
    .pipe(gulp.dest('dist/'));
});


gulp.task('pug', function() {
  return gulp.src('app/pug/views/*.pug')
    .pipe(pug({
      pretty: true,
      compileDebug: true
    }))
    .pipe(gulp.dest('app/'));
});

gulp.task('img', function() {
    return gulp.src('app/img/*.*')
        .pipe(gulp.dest('dist/img/'));
});


gulp.task('clean', require('del').bind(null, 'dist'));

gulp.task('build', ['clean','inline','img']);

gulp.task('serve', ['styles', 'pug'], function() {
  browserSync({
    server: './app',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/*.html').on('change', reload);
  gulp.watch('app/pug/**/*.pug', ['pug']);
});

gulp.task('serve:dist', ['inline'], function() {
  browserSync({
    server: './dist',
    notify: false,
    debugInfo: false,
    host: 'localhost'
  });
});