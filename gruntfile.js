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
				tasks: ['sass']
			}
		},
		uglify: {
			libs: {
				options: {
					preserveComments: 'all'
				},
				files: [
					{
						src: [
							'src/js/components/*.js',
							'src/js/components/textRange.js',
						 	'src/js/components/select.js'
						 ],
						 dest: 'js/scripts.min.js'
					}
				]
			}
		},
		sass: {
			options: {
				outputStyle: "compressed",
				noLineComments: true
			},
			dist: {
				files: {
					'css/css.css': 'src/sass/css.scss'
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
					loopfunc: true,
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
	grunt.registerTask('buildcss',  ['sass']);

	//grunt.loadNpmTasks('grunt-contrib-compass');
}