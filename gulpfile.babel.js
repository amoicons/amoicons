import babel from 'gulp-babel';
import del from 'del';
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import rename from 'gulp-rename';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';

const SRC = './lib';
const DEST = './build';

gulp.task('clean', () => {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del([DEST]);
});

gulp.task('styles', () => {
  return gulp.src(`${SRC}/*.css`).pipe(gulp.dest(DEST));
});

gulp.task('svg', () => {
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

gulp.task('svg2json', ['svg'], () => {
  let files = fs.readdirSync('./build/svg/');
  let data = JSON.parse(fs.readFileSync('./lib/data.json'));

  files.forEach(file => {
    let svg = fs.readFileSync(path.resolve('./build/svg', file));
    let key = path.basename(file, '.svg');

    if (data[key]) {
      let raw = svg.toString();
      data[key].path = /<path.+\/>/g.exec(raw)[0];
      data[key].height = /height="(\d+)"/g.exec(raw)[1];
      data[key].width = /width="(\d+)"/g.exec(raw)[1];
    }
  });
  fs.writeFileSync('build/data.json', JSON.stringify(data));
});

gulp.task('default', ['clean', 'styles', 'svg2json']);
