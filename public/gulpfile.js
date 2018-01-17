var gulp = require("gulp");
var sass = require("gulp-sass");
gulp.task("style",function(){
	return gulp.src("sass/*.scss").pipe(sass({style:"expanded"})).pipe(gulp.dest("css"));
})

gulp.task("watch",function(){
	gulp.watch("sass/*.scss",["style"]);
})