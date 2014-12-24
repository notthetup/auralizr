module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: 'js',
      dest: '.'
    },
    browserify: {
      basic: {
        src: 'public/js/app.js',
        dest: 'public/bundle.js'
      }
    },
    compass: {
      production: {
        options: {
          specify: 'pubic/sass/style.sass',
          cssPath: 'public/',
          outputStyle: 'compressed',
          noLineComments: true
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: ''
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'lib/*.js'] //'public/js/*.js'
    },
    watch: {
      css: {
        files: ['**/*.sass'],
        tasks: ['compass'],
        options: {
          spawn: false,
        }
      },
      scripts: {
        files: ['<%= dirs.src %>/*.js','app.js'],
        tasks: ['jshint','browserify'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['compass','jshint','browserify']);
  grunt.registerTask('serve', ['compass','jshint','browserify', 'connect', 'watch' ]);
  grunt.registerTask('serve-nc', ['jshint','browserify', 'connect', 'watch' ]);
};
