// build core
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// scripts
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

// styles
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');


// utils
var gulpif = require('gulp-if');
var minimist = require('minimist');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

// environments and options
var environments = {
	dev: 'development',
	pro: 'production'
}
var defaultOptions = {
	string: 'env',
	default: { env: process.env.NODE_ENV || environments.dev }
}
var options = minimist(process.argv.slice(2), defaultOptions);

// scripts task
gulp.task('scripts', function() {
	var libs = [
		'src/js/custom.js'
	]; 

	gulp.src(libs)
	.pipe(sourcemaps.init())
	.pipe(concat('custom.js'))
	.pipe(rename('custom.js'))
	.pipe(gulpif(options.env == environments.pro, uglify()))
	.pipe(gulpif(options.env == environments.dev, sourcemaps.write('/')))
	.pipe(gulp.dest('dist/assets/js/')); 
});

// styles task
gulp.task('styles', function() {
	sass('src/sass/styles.scss', {sourcemap: true})
	.on('error', sass.logError)
	.pipe(gulpif(options.env == environments.dev, sourcemaps.write()))
	.pipe(rename('styles.css'))
	.pipe(gulpif(options.env == environments.pro, cleanCSS({compatibility: 'ie9'})))
	.pipe(gulp.dest('dist/assets/css/'))
	.pipe(reload({stream: true}));
});

// images task
gulp.task('images', function() {
	return gulp.src('src/images/**/*.{jpg,jpeg,png,gif,svg}')
	.pipe(gulp.dest('dist/assets/img/'))
	.pipe(reload({stream: true}));
});

// html task
gulp.task('pages', function() {
	return gulp.src('src/pages/*.html')
	.pipe(gulp.dest('dist/'))
	.pipe(reload({stream: true}));
});

// build dist
gulp.task('build', function(cb) {
	runSequence(['styles', 'scripts', 'images', 'pages'], cb);
});

// server the distribution
gulp.task('serve', ['pages'], function() {
	browserSync.init(null, {
		server: {
			baseDir: "dist/"
		},
		online: true
	});
});

// watch task
gulp.task('watch', ['serve'], function() {
	gulp.watch(['src/js/custom.js'], ['scripts']);
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/images/**/*', ['images']);
	gulp.watch(['src/pages/*.html'], ['pages']);
});

// default task
gulp.task('default', ['scripts', 'styles', 'images', 'serve', 'watch']);
