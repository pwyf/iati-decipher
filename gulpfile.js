const gulp = require('gulp')
const del = require('del')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

const outPath = './dist'

const jsFiles = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/chart.js/dist/Chart.js',
  './node_modules/moment/moment.js',
  './node_modules/numeral/numeral.js',
  './node_modules/typeahead.js/dist/typeahead.bundle.js',
  './src/js/helpers.js',
  './src/js/visualise.js',
  './src/js/action.js'
]

gulp.task('clean', () => {
  return del(outPath)
})

gulp.task('build:_core_js', () => {
  return gulp.src(jsFiles)
    .pipe(concat('js.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:_bg_js', () => {
  return gulp.src('background.js', { cwd: './src/js' })
    // .pipe(uglify())
    .pipe(gulp.dest(outPath + '/js'))
})

gulp.task('build:js', gulp.parallel('build:_core_js', 'build:_bg_js'))

gulp.task('build:css', () => {
  return gulp.src(['./src/css/**', './node_modules/bootstrap/dist/css/bootstrap.css', './node_modules/typeahead.js-bootstrap-css/typeaheadjs.css'])
    .pipe(concat('css.css'))
    .pipe(cleanCSS())
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
