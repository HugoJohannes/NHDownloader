/* globals __dirname */

const fs = require('fs');

const archiver = require('archiver');

function createExtensionZip() {
  const output = fs.createWriteStream('dist/extension.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log(`Extension zip: ${archive.pointer()} total bytes.`);
      resolve();
    });

    output.on('error', reject);

    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
  });
}

function createSourceZip() {
  const output = fs.createWriteStream('dist/extension-source.zip');
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });

  return new Promise((resolve, reject) => {
    output.on('close', resolve);
    output.on('error', reject);

    archive.pipe(output);
    archive.glob('**/*', { ignore: ['dist/**', 'node_modules/**', '*.zip'] });
    archive.finalize();
  });
}

async function packageExtension() {
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  await createExtensionZip();
  await createSourceZip();

  console.log('Extension packaged successfully.');
}

packageExtension().catch(console.error);
