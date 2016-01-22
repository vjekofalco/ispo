/**
 * Created by vjekobabic on 19/01/16.
 */
var gulp = require ('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');


//Compiling task
gulp.task('default', function() {
    gulp.src('css/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css/'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('./css'))
});

//Watch task
gulp.task('watch',function() {
    gulp.watch('css/scss/**/*.scss',['default']);
});