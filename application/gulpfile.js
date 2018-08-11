'use strict';

/*
* Dependencias
*/
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

/* GULP.TASK()

Con el método gulp.task() definimos una tarea, este método toma 3 argumentos:
1.- el nombre de la tarea,
2.- la ó las tareas de las que depende esta tarea
3.- la función que ejecutará al llamar esta tarea.

GULP.SRC()

El método gulp.src() toma como parámetro un valor glob es decir,
una cadena que coincida con uno o más archivos usando los patrones que usa el intérprete de comandos de unix(shell)
y retorna un stream que puede ser “pipeado” a un plugin adicional ó hacia el método gulp.dest().

ejemplos de globs

- js/source/1.js coincide exactamente con el archivo.
- js/source/*.js coincide con los archivos que terminen en .js dentro de la carpeta js/source.
- js/** /*.js coincide con los archivos que terminen en .js dentro de la carpeta js y dentro de todas sus sub-carpetas.
- !js/source/3.js Excluye especificamente el archivo 3.js.
- static/*.+(js|css) coincide con los archivos que terminen en .js ó .css dentro de la carpeta static/

GULP.DEST()

Canaliza y escribe archivos desde un Stream, por lo que puede canalizar a varias carpetas.
Creará las carpetas que no existan y retornará el Stream, por si deseamos realizar alguna acción más.

En pocas palabras, sirve para escribir los datos actuales de un Stream.

GULP.WATCH

Ver archivos y hacer algo cuando se modifique un archivo. Esto siempre devuelve un EventEmitter que emite los eventos de cambio.

Tiene 2 formas de usar:

gulp.watch(glob, tareas) ó gulp.watch(glob, callback).

*/

var path = {
  scss: ['./public/src/css/theme.scss', './public/src/**/*.scss'],
  css:'./public/dist/css/'
};

gulp.task('sass', function () {
  return gulp.src(path.scss[0])
    .pipe(sass({
    	outputStyle: 'expanded', // :nested :compact :expanded :compressed
       errLogToConsole: true,
    })
    //.pipe(concat('styles.css'))
    .on('error', sass.logError))
    .pipe(gulp.dest(path.css));
});

/*gulp.task('concat-css', function() {
  gulp.src(path.css+"/*.css")
    .pipe(concat('style.css'))
    .pipe(gulp.dest(path.css))
});*/

gulp.task('watch', function () {
  gulp.watch(path.scss, ['sass']);
});

// Se crea una tarea llamada "build" para lanzar las demás
gulp.task('build', ['sass', 'watch']);
// Con esto conseguimos que la tarea por defecto cargue el resto de tareas del script.
// la tarea por defecto carga con el comando "gulp" sin argumentos en la terminal
gulp.task('default', ['build']);
