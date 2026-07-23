/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *      9. Generates .pot file for i18n and l10n.
 *
 * @tutorial https://github.com/ahmadawais/WPGulp
 * @author Ahmad Awais <https://twitter.com/MrAhmadAwais/>
 */

/**
 * Load WPGulp Configuration.
 *
 * TODO: Customize your project in the wpgulp.js file.
 */
 const config = require('./wpgulp.config.js');

 /**
	* Load Plugins.
	*
	* Load gulp plugins and passing them semantic names.
	*/
 const gulp = require('gulp'); // Gulp of-course.

 // CSS related plugins.
 // const sass = require('gulp-sass')(require('sass'));

 // sass.compiler = require('sass');
 const minifycss = require('gulp-uglifycss'); // Minifies CSS files.
 const autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
 const mmq = require('gulp-merge-media-queries'); // Combine matching media queries into one.
 const rtlcss = require('gulp-rtlcss'); // Generates RTL stylesheet.

 // JS related plugins.
 const concat = require('gulp-concat'); // Concatenates JS files.
 const terser = require('gulp-terser'); // Minifies JS files.
 const babel = require('gulp-babel'); // Compiles ESNext to browser compatible JS.

 // Image related plugins.
 const imagemin = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

 // Utility related plugins.
 const rename = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css.
 const lineec = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
 const filter = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using a glob.
 const sourcemaps = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css).
 const notify = require('gulp-notify'); // Sends message notification to you.
 const browserSync = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.
 const wpPot = require('gulp-wp-pot'); // For generating the .pot file.
 const sort = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.
 const cache = require('gulp-cache'); // Cache files in stream for later use.
 const remember = require('gulp-remember'); //  Adds all the files it has ever seen back into the stream.
 const plumber = require('gulp-plumber'); // Prevent pipe breaking caused by errors from gulp plugins.
 const beep = require('beepbeep');
 const zip = require('gulp-zip'); // Zip plugin or theme file.

 /**
	* Custom Error Handler.
	*
	* @param Mixed err
	*/
 const errorHandler = r => {
	 notify.onError('\n\n❌  ===> ERROR: <%= error.message %>\n')(r);
	 beep();

	 // this.emit('end');
 };

 /**
	* Task: `browser-sync`.
	*
	* Live Reloads, CSS injections, Localhost tunneling.
	* @link http://www.browsersync.io/docs/options/
	*
	* @param {Mixed} done Done.
	*/
 const browsersync = done => {
	 browserSync.init({
		 proxy: config.projectURL,
		 open: config.browserAutoOpen,
		 injectChanges: config.injectChanges,
		 watchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir']
	 });
	 done();
 };

 // Helper function to allow browser reload with Gulp 4.
 const reload = done => {
	 browserSync.reload();
	 done();
 };

 /**
	* Task: `vendorsJS`.
	*
	* Concatenate and uglify vendor JS scripts.
	*
	* This task does the following:
	*     1. Gets the source folder for JS vendor files
	*     2. Concatenates all the files and generates vendors.js
	*     3. Renames the JS file with suffix .min.js
	*     4. Uglifes/Minifies the JS file and generates vendors.min.js
	*/
 gulp.task('vendorsJS', () => {
	 return gulp
		 .src(config.jsVendorSRC, {since: gulp.lastRun('vendorsJS')}) // Only run on changed files.
		 .pipe(plumber(errorHandler))
		 .pipe(remember(config.jsVendorSRC)) // Bring all files back to stream.
		 .pipe(concat(config.jsVendorFile + '.js'))
		 .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
		 .pipe(gulp.dest(config.jsVendorDestination))
		 .pipe(
			 rename({
				 basename: config.jsVendorFile,
				 suffix: '.min'
			 })
		 )
		 .pipe(terser())
		 .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
		 .pipe(gulp.dest(config.jsVendorDestination))
		 .pipe(
			 notify({
				 message: '\n\n✅  ===> VENDOR JS — completed!\n',
				 onLast: true
			 })
		 );
 });

 /**
	* Task: `customJS`.
	*
	* Concatenate and uglify custom JS scripts.
	*
	* This task does the following:
	*     1. Gets the source folder for JS custom files
	*     2. Concatenates all the files and generates custom.js
	*     3. Renames the JS file with suffix .min.js
	*     4. Uglifes/Minifies the JS file and generates custom.min.js
	*/
 gulp.task('customJS', () => {
	 return gulp
		 .src(config.jsCustomSRC, {since: gulp.lastRun('customJS')})
		 .pipe(plumber(errorHandler))
		 .pipe(babel({
			 presets: ['@babel/env']
		 }))
		 .pipe(remember(config.jsCustomSRC))
		 .pipe(lineec())
		 .pipe(rename({suffix: '.min', extname: '.js'}))
		 .pipe(lineec())
		 .pipe(gulp.dest(config.jsCustomDestination))
		 .pipe(
			 notify({
				 message: '\n\n✅  ===> CUSTOM JS — completed!\n',
				 onLast: true
			 })
		 );
 });

 /**
	* Task: `images`.
	*
	* Minifies PNG, JPEG, GIF and SVG images.
	*
	* This task does the following:
	*     1. Gets the source of images raw folder
	*     2. Minifies PNG, JPEG, GIF and SVG images
	*     3. Generates and saves the optimized images
	*
	* This task will run only once, if you want to run it
	* again, do it with the command `gulp images`.
	*
	* Read the following to change these options.
	* @link https://github.com/sindresorhus/gulp-imagemin
	*/
 gulp.task('images', () => {
	 return gulp
		 .src(config.imgSRC)
		 .pipe(
			 cache(
				 imagemin([
					 imagemin.gifsicle({interlaced: true}),
					 imagemin.mozjpeg({quality: 90, progressive: true}),
					 imagemin.optipng({optimizationLevel: 3}), // 0-7 low-high.
					 imagemin.svgo({
						 plugins: [{removeViewBox: true}, {cleanupIDs: false}]
					 })
				 ])
			 )
		 )
		 .pipe(gulp.dest(config.imgDST))
		 .pipe(
			 notify({
				 message: '\n\n✅  ===> IMAGES — completed!\n',
				 onLast: true
			 })
		 );
 });

 /**
	* Task: `clear-images-cache`.
	*
	* Deletes the images cache. By running the next "images" task,
	* each image will be regenerated.
	*/
 gulp.task('clearCache', function (done) {
	 return cache.clearAll(done);
 });

 /**
	* WP POT Translation File Generator.
	*
	* This task does the following:
	* 1. Gets the source of all the PHP files
	* 2. Sort files in stream by path or any custom sort comparator
	* 3. Applies wpPot with the variable set at the top of this file
	* 4. Generate a .pot file of i18n that can be used for l10n to build .mo file
	*/
 gulp.task('translate', () => {
	 return gulp
		 .src(config.watchPhp)
		 .pipe(sort())
		 .pipe(
			 wpPot({
				 domain: config.textDomain,
				 package: config.packageName,
				 bugReport: config.bugReport,
				 lastTranslator: config.lastTranslator,
				 team: config.team
			 })
		 )
		 .pipe(gulp.dest(config.translationDestination + '/' + config.translationFile))
		 .pipe(
			 notify({
				 message: '\n\n✅  ===> TRANSLATE — completed!\n',
				 onLast: true
			 })
		 );
 });

 /**
	* Zips theme or plugin and places in the parent directory
	*
	* zipIncludeGlob: Files to be included in the zip file
	* zipIgnoreGlob: Files to be ignored from the zip file
	* zipDestination: Must be a folder outside of the zip folder.
	* zipName: theme.zip or plugin.zip
	*/
 gulp.task('zip', () => {
	 const src = [...config.zipIncludeGlob, ...config.zipIgnoreGlob];
	 return gulp.src(src).pipe(zip(config.zipName)).pipe(gulp.dest(config.zipDestination));
 });

 /**
	* Watch Tasks.
	*
	* Watches for file changes and runs specific tasks.
	*/
 gulp.task(
	 'default',
	 gulp.parallel('customJS', 'images', browsersync, () => {
		 gulp.watch(config.watchPhp, reload); // Reload on PHP file changes.
		 gulp.watch(config.watchJsCustom, gulp.series('customJS', reload)); // Reload on customJS file changes.
		 gulp.watch(config.imgSRC, gulp.series('images', reload)); // Reload on customJS file changes.
	 })
 );
