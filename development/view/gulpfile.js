var gulp = require('gulp');
var watch = require('gulp-watch');
var google = require('gulp-google-cdn');

var dest = '../../production';

gulp.task('main', ['css', 'js'], function () {
    return gulp.src('static/index.html')
        .pipe(gulp.dest(dest));
});

gulp.task('css', function () {
    return gulp.src('static/**/*.css')
        .pipe(gulp.dest(dest));
});

gulp.task('js', function () {
    return gulp.src('static/**/*.js')
        .pipe(gulp.dest(dest));
});

gulp.task('vendors', function (callback) {
    //TODO...
    callback();
});

gulp.task('watch', function () {
    gulp.watch('static/**/*.{html,css,js}', ['main']);
});
