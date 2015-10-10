'use strict'

config = require './gulp/config'
util = require './gulp/util'

gulp = require 'gulp'

# Load custom tasks from the `tasks` directory
try
    (require 'require-dir')('./gulp/tasks', { recurse: true })
catch err
    console.error err

runSequence = require 'run-sequence'
browserSync = require 'browser-sync'
reload = browserSync.reload

# Compile source
gulp.task 'build', ['styles', 'coffeelint', 'browserify']

# Watch Files For Changes & Reload
gulp.task 'serve', () ->
    browserSync(
        notify: false,
        # Customize the BrowserSync console logging prefix
        logPrefix: 'StarterKit',
        # Run as an https by uncommenting 'https: true'
        # Note: this uses an unsigned certificate which on first access
        #       will present a certificate warning in the browser.
        # https: true,
        # host: '192.168.0.0',
        server: [config.path.htdocs]
    )

    # default
    gulp.watch([config.path.htdocs + '**/*.html'], reload)
    gulp.watch([config.path.jade + '**/*.jade'], ['jade', reload])
    gulp.watch([
        config.sass.lib,
        config.path.scss_common + '**/*.scss',
        config.path.scss + '**/*.scss'
    ], ['styles', reload])
    # gulp.watch([config.path.js + '**/*.js'], [reload])
    gulp.watch([config.path.coffee + '**/*.coffee'], ['coffeelint', 'browserify', reload])

# Build Production Files, the Default Task
gulp.task 'default', (cb) ->
    runSequence('jade', 'build', 'serve', cb)

gulp.task 'deploy', (cb) ->
    runSequence('jade', 'build', 'coffeelint', 'stylestats', 'copy:build', cb)

# gulp.task 'minify', (cb) ->
#     runSequence('minify:html', 'minify:styles', 'minify:scripts', cb)
