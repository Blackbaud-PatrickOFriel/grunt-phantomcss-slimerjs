/*
* grunt-phantomcss
* https://github.com/micahgodbolt/grunt-phantomcss
*
* Copyright (c) 2013 Chris Gladd
* Copyright (c) since 2014 Anselm Hannemann
* Copyright (c) since 2015 Micah Godbolt
*
* Licensed under the MIT license.
*/

'use strict';

module.exports = function (grunt) {
    var jsHintFiles = [
        'Gruntfile.js',
        'tasks/phantomcss.js',
        'phantomjs/runner.js',
        '<%= nodeunit.tests %>'
    ];

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: jsHintFiles,
            options: {
                jshintrc: '.jshintrc'
            }
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            all: jsHintFiles
        },

        // Before generating any new files, remove any
        // previously-created files.
        clean: {
            tests: ['tmp'],
            results: ['results']
        },

        // Configuration to be run (and then tested).
        phantomcss: {
            visualTest: {
                options: {
                    screenshots: 'screenshots',
                    results: 'results',
                    viewportSize: [1280, 800],
                    mismatchTolerance: 0.05,
                    waitTimeout: 5000,
                    rootUrl: 'fixtures',
                    logLevel: 'warning' // debug | info | warning | error
                },
                src: [
                    'fixtures/**/*_test.js'
                ]
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        },

        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        }
    });

    // Timings for Grunt
    require('time-grunt')(grunt);

    // Load all tasks JIT
    require('jit-grunt')(grunt, {
        phantomcss: 'tasks/phantomcss.js'
    });

    grunt.loadNpmTask('grunt-bump');

    // Whenever the "test" task is run, first clean the "tmp" dir,
    // then run this plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'phantomcss', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jscs', 'jshint', 'test']);
};
