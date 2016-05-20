var gulp = require('gulp');
var watch = require('gulp-watch');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');


var dest = '../../production';

gulp.task('main', ['html', 'css', 'js'], function () {

});

gulp.task('html', function () {
    gulp.src('view/**/*.html')
        .pipe(gulp.dest(dest));
});

gulp.task('css', function () {
    gulp.src('view/**/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(dest));
});

gulp.task('js', function () {
    gulp.src('view/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(dest));
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
    })).pipe(gulp.dest(dest + '/lib'));
});

gulp.task('watch', function () {
    gulp.watch('view/**/*.{html,css,js}', ['main']);
});
