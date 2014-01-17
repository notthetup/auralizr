
module.exports = function(grunt) {
grunt.initConfig({
	connect: {
			server: {
				options: {
					port: 8080,
					base: '',
					keepalive: 'true'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');

}
