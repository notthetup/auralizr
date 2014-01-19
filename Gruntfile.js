module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		dirs: {
			src: 'js',
			dest: '.'
		},
		jshint: {
			all: ['Gruntfile.js', '<%= dirs.src %>/*.js'],
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
			},
		},
		watch: {
			scripts: {
				files: ['<%= dirs.src %>/*.js','app.js'],
				tasks: ['jshint','uglify','browserify'],
				options: {
					spawn: false,
				},
			},
		},
		connect: {
			server: {
				options: {
					port: 8080,
					base: ''
				}
			}
		},
		browserify: {
			basic: {
				src: 'app.js',
				dest: 'bundle.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default', ['jshint','uglify','browserify']);

	// Serve presentation locally
	grunt.registerTask( 'serve', ['jshint','uglify','browserify', 'connect', 'watch' ] );

};
