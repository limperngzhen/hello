//  套件定義
//  在package.json內引用的套件
//  npm install gulp --global

//  gulp / yarn run gulp


const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const spritesmith = require('gulp.spritesmith');

const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');


//  ============================================================
//          工作 1 建構SASS Compiler
//  ============================================================


const venderJS = function(cb){
    gulp.src('./src/vender/**/*.js')
        .pipe(concat('vender.js'))
        .pipe(gulp.dest('build/js'))
		.pipe(connect.reload());
    cb();
}


const venderCSS = function(cb){
    gulp.src('./src/vender/**/*.css')
        .pipe(concat('vender.css'))
        .pipe(gulp.dest('build/css'))
		.pipe(connect.reload());
    cb();
}


const venderImage = async function(cb){
	console.log('compressImage');
	gulp.src(['src/vender/**/*.jpg','src/vender/**/*.png','src/vender/**/*.cur'])
		.pipe(gulp.dest('build/images'));
		cb();
}

const buildSass = function(cb){
    console.log('buildSass');
    gulp.src('./src/styles/index.scss')
        .pipe(gulpSass())
        .pipe(gulp.dest('build/css'))
		.pipe(connect.reload());
    cb();
}

const webSever = async function(){
	console.log('reload');
	connect.server({
		livereload:true
	});
}

const compressImage = async function(cb){
	console.log('compressImage');
	gulp.src('src/images/*')
	    .pipe(imagemin())
		.pipe(gulp.dest('build/images'));
		cb();
}

const webFont = async function(cb){
	console.log('webFont');
	gulp.src('src/fonts/*')
		.pipe(gulp.dest('build/fonts'));
		cb();
}

const CSSSprite = async function(cb){
	console.log('CSSSprite');
	gulp.src('src/sprite/*.png').pipe(spritesmith({
		imgName:'sprite.png',
		cssName: 'sprite.css'
	}))
		.pipe(gulp.dest('build'));
		cb();
}

gulp.watch('src/**/*.scss', { events: 'all' }, function(cb){
     console.log('change SASS');
     buildSass(cb);
     cb();
 });
 
 gulp.watch('src/**/*.*', { events: 'all' }, function(cb){
     console.log('change compressImage');
     compressImage(cb);
     cb();
 });
 
 gulp.watch('src/**/*.*', { events: 'all' }, function(cb){
     console.log('change wefont');
     webFont(cb);
     cb();
 });
 
 gulp.watch('src/**/*.*', { events: 'all' }, function(cb){
     console.log('change CSS sprite');
     cb();
 });
/*
 events: 'add', 'addDir', 'change', 'unlink', 'unlinkDir', 'ready', 'error', 'all
 */


// gulp.watch('src/**/*.scss', { events: 'all' }, function(cb){
//     console.log('change SASS');
//     buildSass(cb);
//     cb();
// });


//exports.default = buildSass;
exports.default = gulp.series(buildSass, webSever,compressImage, webFont, CSSSprite, venderJS, venderCSS, venderImage);
//exports.default = gulp.parallel(buildSass, webSever);