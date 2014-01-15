module.exports = function(grunt) {

	// Configuration goes here
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Metadata
		meta: {
			pluginPath: 'printshop-plugins/',
			modulePath: 'printshop-modules/',
			componentPath: 'printshop-component/',
			languagePath: 'printshop-language/',
			buildPath: 'build',
			tempPath: 'temp',
			langs: ['nl-NL']
		},
		copy: {
			// copy component folder to temp folder
			component: {
				files: [
					{
						expand: true,
						cwd: '<%= meta.componentPath %>',
						src: ['administrator/**','frontend/**','libraries/**','media/**','thumbs/**','uploadparts/**','uploads/**','README.md','install.script.php'],
						dest: '<%= meta.tempPath %>/<%= meta.componentPath %>'
					},
					{
						expand: true,
						cwd: '<%= meta.componentPath %>administrator/',
						src: ['bixprintshop.xml','install.script.php'],
						dest: '<%= meta.tempPath %>/<%= meta.componentPath %>'
					}
				]
			},
			// copy repofolders to temp folder
			addons: {
				files: [
					{
						expand: true,
						cwd: '<%= meta.pluginPath %>',
						src: ['**'],
						dest: '<%= meta.tempPath %>/<%= meta.pluginPath %>'
					},
					{
						expand: true,
						cwd: '<%= meta.modulePath %>',
						src: ['**'],
						dest: '<%= meta.tempPath %>/<%= meta.modulePath %>'
					}
				]
			},
			// copy repofolders to temp folder
			langsource: {
				files: [
					{
						expand: true,
						cwd: '<%= meta.languagePath %>',
						src: ['**'],
						dest: '<%= meta.tempPath %>/<%= meta.languagePath %>'
					}
				]
			},
			// copy modules folder to temp folder
			language: {
				files: []
			}
		},
		compress: {},
		// remove temporal files
		clean: {
			unpacked: [
				'<%= meta.tempPath %>/<%= meta.componentPath %>administrator/bixprintshop.xml',
				'<%= meta.tempPath %>/<%= meta.componentPath %>administrator/install.script.php',
				'<%= meta.tempPath %>/<%= meta.componentPath %>frontend/assets/css/*_style.css'
			],
			temp: ['<%= meta.tempPath %>/**/*']
		}
	});

	// Load plugins here
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Define your tasks here
	// register default task
	grunt.registerTask('default', 'Prepares Printshop Packages', function() {

		// execute in order
		grunt.task.run('copy:component');
		grunt.task.run('copy:addons');
		grunt.task.run('copy:langsource');
		grunt.task.run('process_component');
		grunt.task.run('clean:unpacked');
		grunt.task.run('process_plugins');
		grunt.task.run('process_modules');
		grunt.task.run('copy:language');
		grunt.task.run('compress');
		grunt.task.run('clean:temp');
	});
	grunt.registerTask('component', 'Prepares Printshop Component only', function() {
		grunt.task.run('copy:component');
		grunt.task.run('copy:langsource');
		grunt.task.run('process_component');
		grunt.task.run('clean:unpacked');
		grunt.task.run('copy:language');
		grunt.task.run('compress');
		grunt.task.run('clean:temp');
	});
	grunt.registerTask('addons', 'Prepares Printshop Addons only', function() {
		grunt.task.run('copy:addons');
		grunt.task.run('copy:langsource');
		grunt.task.run('process_plugins');
		grunt.task.run('process_modules');
		grunt.task.run('copy:language');
		grunt.task.run('compress');
		grunt.task.run('clean:temp');
	});
	//process_component task
	grunt.registerTask('process_component', 'pack comp dirs, copy xml', function() {

		// get current configs
		var compress = grunt.config.get('compress') || {},
			copy = grunt.config.get('copy') || {},
			langs = grunt.config.get('meta.langs');
		
		// add language files
		langs.forEach(function(lang){
			copy.language.files.push ({
				expand: true,
				cwd: '<%= meta.tempPath %>/<%= meta.languagePath %>administrator/language/' + lang + '/',
				src: [lang + '.<%= pkg.name %>.ini', lang + '.<%= pkg.name %>.sys.ini'],
				dest:'<%= meta.tempPath %>/<%= meta.componentPath %>administrator/language/' + lang + '/'
			});
			copy.language.files.push ({
				expand: true,
				cwd: '<%= meta.tempPath %>/<%= meta.languagePath %>language/' + lang + '/',
				src: [lang + '.<%= pkg.name %>.ini'],
				dest:'<%= meta.tempPath %>/<%= meta.componentPath %>frontend/language/' + lang + '/'
			});
		});

		// set the compress config for component
		compress['component'] = {
			options: {
				archive: '<%= meta.buildPath %>/component/<%= pkg.name %>_<%= pkg.version %>.zip',
				mode: 'zip'
			},
			files: [
				{
					expand: true, 
					cwd: '<%= meta.tempPath %>/<%= meta.componentPath %>', 
					src: ['**'], 
					dest: ''
				} 
			]
		};
		
		// save the new configs
		grunt.config.set('compress', compress);
		grunt.config.set('copy', copy);
	});
	
	//process_plugins task
	grunt.registerTask('process_plugins', 'iterates over all plugins', function() {

		// get current configs
		var compress = grunt.config.get('compress') || {},
			copy = grunt.config.get('copy') || {},
			baseDirs = ['bixprintshop','bixprintshop_attrib','bixprintshop_betaal','bixprintshop_machine','bixprintshop_mail'
						,'bixprintshop_mail','bixprintshop_order','bixprintshop_vervoer'
						,'system','content','search','user'],
			root = [],
			langs = grunt.config.get('meta.langs');
		
		// get plugins rootdirs
		baseDirs.forEach(function(baseDir){
			root.push(grunt.template.process('<%= meta.tempPath %>/<%= meta.pluginPath %>'+baseDir + '/') + '*')
		});

		// iterate trough plugins directories
		grunt.file.expand(root).forEach(function(dir){
			// skip files
			if (!grunt.file.isDir(dir)) return true;

			var plugin = dir.replace(/\\/g,'/').replace( /.*\//, '' ),
				parent_dir = dir.replace('/' + plugin, '').replace(/\\/g,'/').replace( /.*\//, '' ),
				langfileBase = '.plg_' + parent_dir + '_' + plugin;
				
			// add language files
			langs.forEach(function(lang){
				copy.language.files.push ({
					expand: true,
					cwd: '<%= meta.tempPath %>/<%= meta.languagePath %>administrator/language/' + lang + '/',
					src: [lang + langfileBase + '.ini',lang + langfileBase + '.sys.ini'],
					dest: dir + '/language/' + lang + '/'
				});
			});
			
			// set the compress config for this plugin
			compress[plugin] = {
				options: {
					archive: '<%= meta.buildPath %>/plugins/' + parent_dir + '/' + parent_dir + '-' + plugin + '_<%= pkg.version %>.zip',
					mode: 'zip'
				},
				files: [
					{
						expand: true, 
						cwd: dir, 
						src: ['**'], 
						dest: ''
					} 
				]
			};
		});

		// save the new configs
		grunt.config.set('compress', compress);
		grunt.config.set('copy', copy);
	});

	//process_modules task
	grunt.registerTask('process_modules', 'iterates over all modules', function() {

		// get current configs
		var compress = grunt.config.get('compress') || {},
			copy = grunt.config.get('copy') || {},
			langs = grunt.config.get('meta.langs'),
			// get modules rootdirs
			root = [
				grunt.template.process('<%= meta.tempPath %>/<%= meta.modulePath %>/administrator/') + '*',
				grunt.template.process('<%= meta.tempPath %>/<%= meta.modulePath %>') + '*'
			];

		// iterate trough modules directories
		grunt.file.expand(root).forEach(function(dir){
			// skip files
			if (!grunt.file.isDir(dir)) return true;

			var module = dir.replace(/\\/g,'/').replace( /.*\//, '' ),
				parent_dir = dir.replace('/' + module, '').replace(/\\/g,'/').replace( /.*\//, '' ),
				langfileBase = '.' + module,
				adminDir = parent_dir == 'administrator'?'administrator/':'';
				
			// skip admindir itself
			if (module == 'administrator') return true;
			
			// add language files
			langs.forEach(function(lang){
				copy.language.files.push ({
					expand: true,
					cwd: '<%= meta.tempPath %>/<%= meta.languagePath %>' + adminDir + 'language/' + lang + '/',
					src: [lang + langfileBase + '.ini',lang + langfileBase + '.sys.ini'],
					dest: dir + '/language/' + lang + '/'
				});
			});
			// set the compress config for this module
			compress[module] = {
				options: {
					archive: '<%= meta.buildPath %>/modules/' + module + '_<%= pkg.version %>.zip',
					mode: 'zip'
				},
				files: [
					{
						expand: true, 
						cwd: dir, 
						src: ['**'], 
						dest: ''
					} 
				]
			};
		});

		// save the new configs
		grunt.config.set('compress', compress);
		grunt.config.set('copy', copy);
	});

};