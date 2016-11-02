var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
/*var sass = require('gulp-sass');*/
var minifyCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var clean = require('gulp-clean');

gulp.task('index', function () {
  return gulp.src('www/index.html')
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', minifyCss()))
      .pipe(gulp.dest('app'));
});
/*gulp.task('compress', function() {
  return gulp.src('www/js/!**!/!*.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
});*/
// 语法检查
gulp.task('jshint', function () {
  return gulp.src('www/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
});
//backup www content
gulp.task("backup",function(){
  gulp.src('www/**/*.*')
      .pipe(gulp.dest('www_b/'));
})
// 复制文件
gulp.task('copyToWWW', function () {
  gulp.src('app/**/*.*')
      .pipe(gulp.dest('www/'));
});
// 复制文件
gulp.task('copyToApp', function () {
  gulp.src('www/templates/**')
      .pipe(gulp.dest('app/templates/'))
  gulp.src('www/img/*')
      .pipe(gulp.dest('app/img/'))
  gulp.src('www/js/**/*.js')
      .pipe(gulp.dest('app/js/'))

});
// 清空图片、样式、js
gulp.task('clean', function () {
  return gulp.src(['www/css/*', 'www/js/*', 'www/img/*', 'www/lib/*', 'www/templates/*'], {read: false})
      .pipe(clean({force: true}));
});

/*var paths = {
  sass: ['./scss/!**!/!*.scss']
};*/

gulp.task('default', ['backup','copyToApp','index','clean','copyToWWW']);

/*gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});*/

gulp.task('watch', function() {
/*  gulp.watch(paths.sass, ['sass']);*/
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
