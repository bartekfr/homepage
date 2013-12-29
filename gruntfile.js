module.exports = function(grunt){
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		distdir: 'dist',
		appdir: 'app',
		watch: {
			jslibs: {
				files: ['src/js/components/*.js'],
				tasks: ['uglify']
			},
			csscommon: {
				files: ['src/sass/*.scss'],
				tasks: ['compass:common']
			}
		},
		uglify: {
			libs: {
				options: {
					preserveComments: 'all'
				},
				files: [
					{src: 'src/js/components/*.js', dest: 'js/scripts.min.js'}
				]
			}
		},
		compass: {
			common: {
				options: {
					sassDir: "src/sass",
					cssDir: "css",
					outputStyle: "expanded",
					noLineComments: true
				}
			}
		},
		copy: {
			main:  {
				expand: true,
				cwd: 'src/js',
				src: 'vendor/*.js',
				dest: 'js/',
				filter: 'isFile',
			}
		},
		jshint: {
			components: {
				options: {
					curly: true,
					eqeqeq: true,
					eqnull: true,
					browser: true,
					globals: {
						jQuery: true
					},
				},
				src: ['src/js/components']
			}
		}

	});

	grunt.registerTask('default', ['uglify', 'buildcss', 'copy']);
	grunt.registerTask('buildcss',  ['compass:common']);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}