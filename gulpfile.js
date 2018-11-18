const gulp = require('gulp')
const gulpSequence = require('gulp-sequence')
const tasks = require('require-dir')('./gulpTasks')

gulp.task('default', gulpSequence.apply(null, tasks.config[0]))
gulp.task('build', gulpSequence.apply(null, tasks.config[1]))
