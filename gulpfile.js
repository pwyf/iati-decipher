const gulp = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')

const outPath = './dist'

const jsFiles = [
  './src/js/action.js',
  './node_modules/underscore/underscore.js'
]

gulp.task('clean', () => {
  return del(outPath)
})

gulp.task('build:_core_js', () => {
  return gulp.src(jsFiles)
    .pipe(concat('js.js'))
    .pipe(uglify())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:_bg_js', () => {
  return gulp.src('background.js', { cwd: './src/js' })
    .pipe(uglify())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:js', gulp.parallel('build:_core_js', 'build:_bg_js'))

gulp.task('build:css', () => {
  return gulp.src(['./src/css/**', './node_modules/bootstrap/dist/css/bootstrap.css'])
    .pipe(concat('css.css'))
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outPath + '/css'))
})

gulp.task('build:assets', () => {
  return gulp.src(['./src/static/**', './node_modules/bootstrap/dist/fonts*/*'])
    .pipe(gulp.dest(outPath))
})

gulp.task('build', gulp.series('clean', gulp.parallel('build:css', 'build:js', 'build:assets')))

gulp.task('watch', gulp.series(['build'], () => {
  gulp.watch('./src/**', gulp.parallel('build'))
}))

gulp.task('default', gulp.parallel('build'))
