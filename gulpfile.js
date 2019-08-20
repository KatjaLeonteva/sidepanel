'use strict';

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemaps = require('gulp-sourcemaps');
const del = require(`del`);
const rollup = require(`gulp-better-rollup`);
const less = require(`gulp-less`);
const autoprefixer = require(`gulp-autoprefixer`);

gulp.task(`copy`, () => {
    return gulp.src([
        `src/*.{html,ico}`,
        `src/img/**/*.*`
    ], {base: `src/`}).
    pipe(gulp.dest(`dist`));
});

gulp.task(`styles`, () => {
    return gulp.src(`src/less/style.less`)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(`dist/css`));
});

gulp.task(`scripts`, () => {
    return gulp.src(`src/js/main.js`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rollup({}, `iife`))
        .pipe(sourcemaps.write(`.`))
        .pipe(gulp.dest(`dist/js`))
});

gulp.task(`clean`, () => {
    return del(`dist`);
});

gulp.task(`watch`, [`build`], () => {
    gulp.watch(`src/js/**/*.js`, [`scripts`]);
    gulp.watch(`src/less/**/*.less`, ['styles']);
});

gulp.task(`build`, [`clean`], () => {
    gulp.start(`copy`, `styles`, `scripts`);
});
