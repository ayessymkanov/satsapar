var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imageMin = require('gulp-imagemin'),
    cssClean = require('gulp-clean-css'),
    cssConcat = require('gulp-concat-css');


gulp.task('styles', function() {
  return gulp.src('./css/*.scss')
  .pipe(sass())
  .pipe(cssConcat('./styles.css'))
  .pipe(cssClean())
  .pipe(gulp.dest('./dist/styles'));
});

gulp.task('images', function() {
  return gulp.src('./img/*.*')
  .pipe(imageMin())
  .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['styles', 'images']);
