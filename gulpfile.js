var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var cp = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

function jekyllBuild() {
  return cp.spawn( jekyll , ['build', '--config', '_config_dev.yml'], {stdio: 'inherit'})
}

function css() {
  return gulp.src('_scss/styles.scss')
    .pipe(sass({
      includePaths: ['_scss'],
      outputStyle: 'expanded',
      onError: browserSync.notify
    }))
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('assets/css'));
}

function browserSyncServe(done) {
  browserSync.init({
    server: {
      baseDir: "_site"
    }
  })
  done();
}

function browserSyncReload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch('_scss/**/*.scss', css)
  gulp.watch(
    [
    '*.html',
    'buddies/**/*.html',
    'adopt/*.html',
    '_layouts/*.html',
    '_pages/*',
    '_posts/*',
    '_data/*',
    '_includes/*'
  ],
  gulp.series(jekyllBuild, browserSyncReload));
}

gulp.task('css', gulp.parallel(css))
gulp.task('default', gulp.parallel(jekyllBuild, browserSyncServe, watch))
