var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require("gulp-nodemon");
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');

/*
* Created by Joshua Sawyer (https://github.com/jcsawyer123)
* 
* Development Environment to create static sites.
* - SCSS Compilation
* - HTML,CSS, JS Minification
* - NodeJS Web Server
* - Automatic NodeJS restarting (For any changes to web server)
* - Live Refresh of web page for any content changes
*
* *NOTE* This is not designed for the creation of web applications. It can be adapted but that is not its aim.
*/



/*
    GULP INFORMATION
    - Ignore if you know how gulp works

    -- Top Level Functions --
    gulp.tasks - Define Tasks
    gulp.src - Points to files to use
    gulp.dest - Pointsd to output folder
    gulp.watch - Watch files and folders for changes
*/

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

/*
    ==================================================
    Application Running
    - Run : sync, nodemon, watch, public
    - Sync: Reloads page on any changes using browserSync
    - Nodemon: Restarts App.js if changed
    - Watch: Watch for changes in SRC
    ==================================================
*/
// Refreshes page if there are updates in the views
gulp.task('run', ['sync', 'nodemon', 'watch', 'public'], () => {
    console.log("Application Started");
})

gulp.task('sync', () => {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        port: 3002
    });
    gulp.watch("./public/js/*.js").on("change", browserSync.reload);
    gulp.watch("./public/styles/*.css").on("change", browserSync.reload);
    gulp.watch("./public/*.html").on("change", browserSync.reload);
    gulp.watch("./public/*.ejs").on("change", browserSync.reload);

})
// Runs of the application
gulp.task('nodemon',()=> {
    return nodemon({
        script: './app.js'
    })
    .on('restart', () => {
        console.log('Restarted');
    })
});
// Watchs any scripts
gulp.task('watch', ()=> {
    gulp.watch('./src/js/*.js', ['scripts']);
    gulp.watch('./src/sass/*.scss', ['sass']);
    gulp.watch('./src/*.html', ['html']);
})

/*
    ==================================================
    SRC to public
    - Public : Sass, ExternalJS, Scripts, HTML
    - SASS: Compiles SASS to CSS (User and Bootstrap)
    - ExternalJS: Moves required JS from Node Modules to Public
    - Scripts: Moves and Minifys user JS into Public
    - HTML: Moves HTML into Public
    ==================================================
*/
gulp.task('public', ['sass', 'externaljs', 'scripts', 'html'], () => {
    console.log("Files moved to public");
})

// SASS
//      - Compile SASS (User & Bootstrap)
gulp.task('sass', () => {
    return gulp.src(["./src/sass/*.scss", "node_modules/bootstrap/scss/bootstrap.scss"])
    .pipe(sass().on('error', sass.logError))
        // Auto-prefix css styles for cross browser compatibility
    // .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // .pipe(csso()) //Minify the CSS
    .pipe(gulp.dest('./public/styles'))
});

// JS
//      - Moves the JS required from Node Modules
gulp.task("externaljs", () => {
    return gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/tether/dist/js/tether.min.js"
    ])
    .pipe(gulp.dest("./public/js/external"))
});

// SCRIPTS
//      - Moves and minifys JS
gulp.task("scripts", () => {
    return gulp.src(['./src/js/**/*.js'])
    .pipe(gulp.dest('./public/js'));
})

// HTML
//      - Moves HTML to Public
gulp.task('html', () => {
    return gulp.src(['./src/*.html'])
    .pipe(gulp.dest('./public/'))
});



// The main function that is ran when Gulp is started without specifying task
gulp.task("default", ["run"]);

