module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		coffee: {
			options: {
				sourceMap: true,
				join: true
			},
			files: {
				src: 'src/<%= pkg.name %>.coffee',
				dest: '<%= pkg.name %>.js'
			}
		},
		watch: {
			scripts: {
				files: ['**/*.coffee'],
				tasks: ['coffee', 'uglify'],
				options: {
					spawn: false
				}
			}
		},
		uglify: {
			options: {
				report: false,
				sourceMap: '<%= pkg.name %>.min.js.map',
				sourceMapIn: ['<%= pkg.name %>.js.map'],
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: '<%= pkg.name %>.js',
				dest: '<%= pkg.name %>.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	// Default task(s).
	grunt.registerTask('build', ['coffee', 'uglify']);
	grunt.registerTask('default', ['watch']);

};