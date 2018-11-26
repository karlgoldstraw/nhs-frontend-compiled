const gulp      = require('gulp'),
browserSync     = require('browser-sync').create();
sass            = require('gulp-sass');
nunjucksRender  = require('gulp-nunjucks-render');


const PATHS = {
    templates: 'src/templates',
    pages: 'src/pages',
    scss: 'src/scss',
    output: 'docs',
}

// writing up the gulp nunjucks task
gulp.task('nunjucks', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(PATHS.pages + '/**/*.+(njk|html)')
        .pipe(nunjucksRender({
          path: [PATHS.templates],
          watch: true,
        }))
        .pipe(gulp.dest(PATHS.output));
});


gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: PATHS.output
        },
    });
});


// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src([PATHS.scss + '/*.scss'])
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS.output + '/css'))
        .pipe(browserSync.stream());
});



// Static Server + watching scss/html files
gulp.task('serve', function() {
    gulp.watch([PATHS.pages + '/**/*.+(njk|html)', PATHS.templates + '/**/*.+(njk|html)'], ['nunjucks'])
    gulp.watch([PATHS.scss + '/*.scss'], ['sass'])
    gulp.watch(PATHS.output + '/*').on('change', browserSync.reload);
});


gulp.task('default', ['browserSync', 'serve']);
