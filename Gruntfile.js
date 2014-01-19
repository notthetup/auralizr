module.exports = function(grunt) {

	grunt.initConfig({

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
					base: '',
					keepalive: 'true'
				}
			}
		},

		watch: {

			css: {
				files: ['**/*.sass'],
				tasks: ['compass'],
				options: {
					spawn: false,
				}
			}

		}

	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['compass', 'watch']);
	grunt.registerTask('serve', ['connect']);

}
