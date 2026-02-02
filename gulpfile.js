const { src, dest } = require('gulp');

/**
 * Copia os arquivos de ícones para todos os diretórios possíveis
 */
function buildIcons() {
  return src('*.svg')
    .pipe(dest('dist/'))
    .pipe(dest('dist/icons/'))
    .pipe(dest('dist/nodes/'))
    .pipe(dest('dist/nodes/Digitalsac/'))
    .pipe(dest('dist/icons/n8n-nodes-digitalsac/dist/nodes/digitalsac/'));
}

exports['build:icons'] = buildIcons; 