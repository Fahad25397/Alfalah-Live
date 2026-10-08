const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  "https://i.pinimg.com/736x/db/c7/88/dbc7888120028674c01df65eea66aa6b.jpg",
  "https://i.pinimg.com/736x/c4/d1/f1/c4d1f11ba1ff102dc566ff683fc82c61.jpg",
  "https://i.pinimg.com/736x/a9/2b/19/a92b1968cbe9e8234695f1e692bc2fea.jpg",
  "https://i.pinimg.com/736x/cd/6b/70/cd6b70759322c0ace9cfcde88faa1b2a.jpg",
  "https://i.pinimg.com/1200x/d7/26/f3/d726f31bda765ec9bef5146a781e8e10.jpg",
  "https://i.pinimg.com/736x/9e/ae/cf/9eaecf78abe35db4fb23819bb7248064.jpg",
  "https://i.pinimg.com/1200x/25/46/7d/25467d0bde67cb1c5171a1f7aa85e72b.jpg",
  "https://i.pinimg.com/1200x/21/55/0b/21550b3e3ca539560f6963f6edf38332.jpg",
  "https://i.pinimg.com/1200x/7b/32/8b/7b328bdced1ff3db6faacf23d9a3445b.jpg"
];

const nextDir = path.join(__dirname, 'alfalah-next', 'public', 'hero-images');
const reactDir = path.join(__dirname, 'frontend', 'public', 'hero-images');

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  for (let i = 0; i < images.length; i++) {
    const filename = `hero-${i + 1}.jpg`;
    console.log(`Downloading ${filename}...`);
    try {
      await download(images[i], path.join(nextDir, filename));
      fs.copyFileSync(path.join(nextDir, filename), path.join(reactDir, filename));
    } catch (err) {
      console.error(`Failed to download ${filename}:`, err);
    }
  }
  console.log("Done!");
}

run();
