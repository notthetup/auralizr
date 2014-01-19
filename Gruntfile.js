module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs: {
      src: 'js',
      dest: '.'
    },
    browserify: {
      basic: {
        src: 'app.js',
        dest: 'bundle.js'
      }
    },
    compass: {
      production: {
        options: {
          specify: 'sass/style.sass',
          cssPath: '.',
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
      all: ['Gruntfile.js', '<%= dirs.src %>/*.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        preserveComments: false,
        compress: true,
        mangle: true
      },
      build: {
        src: '<%= dirs.src %>/<%= pkg.name %>.js',
        dest: '<%= dirs.dest %>/<%= pkg.name %>.min.js'
      }
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
        tasks: ['jshint','uglify','browserify'],
        options: {
          spawn: false,
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['compass','jshint','uglify','browserify']);
  grunt.registerTask('serve', ['compass','jshint','uglify','browserify', 'connect', 'watch' ]);
  grunt.registerTask('serve-nc', ['jshint','uglify','browserify', 'connect', 'watch' ]);
};
