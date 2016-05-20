var gulp = require('gulp');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');

var destination = './static';

gulp.task('default', ['main'], function (callback) {
    callback();
});

gulp.task('main', ['html', 'css', 'js', 'vendors'], function (callback) {
    callback();
});

gulp.task('html', function () {
    gulp.src('view/**/*.html')
        .pipe(gulp.dest(destination));
});

gulp.task('css', function () {
    gulp.src('view/**/*.css')
        .pipe(cleanCSS())
        .pipe(concatCss('app.min.css'))
        .pipe(gulp.dest(destination));
});

gulp.task('js', function () {
    gulp.src('view/**/*.js')
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(destination));
});

gulp.task('vendors', function () {
    gulp.src(mainBowerFiles({
        'overrides': {
            'jquery': {
                'main': [
                    './dist/jquery.min.js'
                ]
            }
        }
    }))
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest(destination + '/lib'));
});

gulp.task('watch', function () {
    gulp.watch('view/**/*.{html,css,js}', ['main']);
});
