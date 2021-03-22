const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const pathPrefix = process.argv.slice(2)[0];

const files = getAllFiles(`./${pathPrefix}/`, '.css');
let data = [];
let cmd = [];

if (!files && files.length <= 0) {
  console.log('CSS файлы отсутствуют');
  return;
}

files.forEach((f) => {
  const originalSize = getFilesizeInKiloBytes(f) + 'kb';
  const o = { file: f, originalSize: originalSize, newSize: '' };
  data.push(o);
});

console.log('Запуск PurgeCSS...');

cmd = `npx purgecss --config ./purgecss.config.js --output ${pathPrefix}`;

exec(cmd, (error, stdout, stderr) => {
  console.log("PurgeCSS завершила работу\n");

  data.forEach((d) => {
    const newSize = getFilesizeInKiloBytes(d.file) + 'kb';
    d.newSize = newSize;
  });
  console.table(data);

});

function getFilesizeInKiloBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getAllFiles(dir, extension, arrayOfFiles) {
  const files = fs.readdirSync(dir);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dir + '/' + file, extension, arrayOfFiles);
    } else {
      if (file.endsWith(extension)) {
        arrayOfFiles.push(path.join(dir, '/', file));
      }
    }
  });

  return arrayOfFiles;
}
