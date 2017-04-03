import babel from 'gulp-babel';
import del from 'del';
import gulp from 'gulp';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';

const SRC = './lib';
const DEST = './build';

gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([DEST]);
});

gulp.task('svg', ['clean'], function() {
  const config = {
    svgmin: {
      plugins: [
        { removeAttrs: { attrs: ['id', 'class', 'data-name', 'fill'] } },
        { sortAttrs: true },
        { removeTitle: true },
      ],
    },
  };

  return gulp
    .src(`${SRC}/svg/*.svg`)
    .pipe(
      svgmin({
        js2svg: { pretty: true },
        plugins: config.svgmin.plugins,
      })
    )
    .pipe(gulp.dest(`${DEST}/svg/`))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.amoicons.svg'))
    .pipe(gulp.dest(DEST));
});

gulp.task('default', ['svg']);
