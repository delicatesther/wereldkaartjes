'use strict';

var gulp = require('gulp');

var gutil = require('gulp-util');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var pkg = require('./package.json');
var paths = pkg.paths;
var uglify = require('gulp-uglify');
var gif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var mmq = require('gulp-merge-media-queries');

// By default production is false
var production = false;

// Build CSS
gulp.task('style', function() {
  return gulp.src(paths.sass.src + 'style.scss')
  .pipe(gif(production,
    sass({
      outputStyle: 'compressed'
    }),
    sass({
      sourceComments: true,
      sourceMap: '/' + paths.sass.src,
      outputStyle: 'expanded'
    }).on('error', sass.logError)))
  .pipe(autoprefixer())
  .pipe(mmq())
  .pipe(gulp.dest(paths.sass.dest));
});


// sprite sheets for png images and scss creation
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

gulp.task('spritePng', function () {
    var
    spritePng_scss    = "_sprite-png.scss",   //auto-generated .scss file
    spritePng_png     = "sprite-png.png",     //auto-generated .png sprite
    spriteSvg_png2x   = "sprite-png@2x.png";  //auto-generated .png sprite for retina

    var spriteData = gulp.src(paths.spritePng.src + '**/*.**')
    .pipe(spritesmith({
        retinaSrcFilter: [paths.spritePng.src_retina + '*.**'],
        retinaImgName: spriteSvg_png2x,
        retinaImgPath: paths.spritePng.destRelative + spriteSvg_png2x,
        imgName: spritePng_png,
        imgPath: paths.spritePng.destRelative + spritePng_png,
        cssName: spritePng_scss,
        cssVarMap: function(sprite) {
            sprite.name = 'sprite-png-' + sprite.name
        },
    }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
    .pipe(gulp.dest(paths.spritePng.dest));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
    .pipe(gulp.dest(paths.spritePng.dest_css));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});



//icon fonts
var iconfontCss    = require('gulp-iconfont-css');
var iconfont       = require('gulp-iconfont');

gulp.task('iconfont', function() {
    var
        iconfont_config = "iconfont-config.scss",       //Config file to generate the .scss file
        iconfont_scss = "_iconfont.scss";               //auto-generated .png sprite

    return gulp.src([paths.iconfont.src + '*.svg'], {base: paths.iconfont.base})      //location of the original svg's
    .pipe(iconfontCss({
        fontName: 'iconfont',
        cssClass: 'iconfont',                            //prefix for the fonts class
        path: paths.iconfont.conf + iconfont_config,     // scss config file
        targetPath: paths.iconfont.destScss + iconfont_scss, // Created scss file by the config file
        fontPath: paths.iconfont.destFontRelative        // location of created fonts relative to .css
    }))

    .pipe(iconfont({
        fontName: 'iconfont',                            // required
        //fontName: 'iconfont64',                        // in case of base 64
        prependUnicode: false,
        formats: ['ttf', 'eot', 'woff'],                 // default, 'woff2' and 'svg' are available
        //formats: ['ttf'],                              // in case of base 64 only use the ttf
        normalize: true,
        fontHeight: 1001,
        centerHorizontally: true
    }))
    .pipe(gulp.dest(paths.iconfont.destFont));
});

// converting the font created in "iconfont" above to base 64
// when using this please use above fontName: 'iconfont64' and only formats: ['ttf']
// also wipe all fonts from the dest folder before you start
// iconfont-config.scss needs to be changed to use base64 (see comments there)
var cssfont64 = require('gulp-cssfont64');

gulp.task('base64', function () {
    return gulp.src(paths.base64css.src + '*.ttf')
    .pipe(cssfont64())
    .pipe(gulp.dest(paths.base64css.destcss));
});



// sprite sheets for svg and scss creation
var spriteSvg = require('gulp-svg-sprite');

gulp.task('spriteSvg', function () {
  var
  spriteSvg_config = "sprite-svg-config.scss",    //Config file to generate the .scss file
  spriteSvg_scss = "_sprite-svg.scss",           //auto-generated .scss file
  spriteSvg_svg = "sprite-svg.svg";              //auto-generated .png sprite

  return gulp.src(paths.spriteSvg.src + '*')
  .pipe(spriteSvg({
    shape: {
      spacing: {
        padding: 10
      }
    },
    mode: {
      css: {
        dest: "./",
        layout: "vertical",
        sprite: paths.spriteSvg.destSvg + spriteSvg_svg,
        bust: false,
        render: {
          scss: {
            dest: paths.spriteSvg.destScss + spriteSvg_scss,
            template: paths.spriteSvg.conf + spriteSvg_config
          }
        }
      }
    },
    variables: {
      mapname: "icons"
    }
  }))
  .pipe(gulp.dest(paths.spriteSvg.srcRoot));
});


gulp.task('js', function(callback) {
  return gulp.src(paths.js.src + '**/*')
  // .pipe(uglify().on('error', function(e) {
  //   console.log(e);
  // }))
  .pipe(gulp.dest(paths.js.dest));
});




gulp.task('production', function (callback) {
  production = true;
  runSequence('build', callback);
});

gulp.task('build', function (callback) {
  runSequence('js','spritePng','iconfont','spriteSvg','style', callback);
});

gulp.task('default', [ 'style'], function () {

  gulp.watch(paths.sass.src + '**/*.scss', ['style']);
  gulp.watch(paths.js.src + 'main.js', ['js']);
  gulp.watch(paths.spritePng.src + '**/*.**', ['spritePng']);

  // TODO: modify png sprites watch and add more watch tasks (svg sprites, icon fonts)
});
