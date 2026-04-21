const { src, dest } = require('gulp');

/**
 * Copies SVG icons and node codex JSON files to the dist folder.
 */
function buildIcons() {
  return src(
    ['nodes/**/*.svg', 'nodes/**/*.node.json', 'credentials/**/*.svg'],
    { base: '.' },
  ).pipe(dest('dist/'));
}

exports['build:icons'] = buildIcons;
