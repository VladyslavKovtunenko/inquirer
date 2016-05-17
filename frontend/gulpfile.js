var gulp = require('gulp');
var google = require('gulp-google-cdn');

gulp.task('default', function () {
    return gulp.src('view/*.html')
               .pipe(google(require('./bower.json')))
               .pipe(gulp.dest('../production'));
});

gulp.task('main', function () {
    return gulp.src('app/**/*.{js,css}')
               .pipe(gulp.dest('awf/'));
});

gulp.task('vendors', function (callback) {
    //TODO...
    callback();
});

gulp.task('watch', function (callback) {
    //TODO...
    callback();
});
