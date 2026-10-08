const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: "hero-1.jpg", url: "https://i.pinimg.com/736x/db/c7/88/dbc7888120028674c01df65eea66aa6b.jpg" },
  { name: "hero-2.jpg", url: "https://i.pinimg.com/736x/c4/d1/f1/c4d1f11ba1ff102dc566ff683fc82c61.jpg" },
  { name: "hero-3.jpg", url: "https://i.pinimg.com/736x/a9/2b/19/a92b1968cbe9e8234695f1e692bc2fea.jpg" },
  { name: "hero-4.jpg", url: "https://i.pinimg.com/736x/cd/6b/70/cd6b70759322c0ace9cfcde88faa1b2a.jpg" },
  { name: "hero-5.jpg", url: "https://i.pinimg.com/1200x/d7/26/f3/d726f31bda765ec9bef5146a781e8e10.jpg" },
  { name: "hero-6.jpg", url: "https://i.pinimg.com/736x/9e/ae/cf/9eaecf78abe35db4fb23819bb7248064.jpg" },
  { name: "hero-7.jpg", url: "https://i.pinimg.com/1200x/25/46/7d/25467d0bde67cb1c5171a1f7aa85e72b.jpg" },
  { name: "hero-8.jpg", url: "https://i.pinimg.com/1200x/21/55/0b/21550b3e3ca539560f6963f6edf38332.jpg" },
  { name: "hero-9.jpg", url: "https://i.pinimg.com/1200x/7b/32/8b/7b328bdced1ff3db6faacf23d9a3445b.jpg" },
];

const nextDir = path.join(__dirname, 'alfalah-next', 'public', 'hero-images');
const reactDir = path.join(__dirname, 'frontend', 'public', 'hero-images');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.pinterest.com/',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      }
    };

    const file = fs.createWriteStream(dest);
    https.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      console.log(`  Status: ${response.statusCode}, Content-Type: ${response.headers['content-type']}`);
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const img of images) {
    console.log(`Downloading ${img.name} from ${img.url}`);
    try {
      await download(img.url, path.join(nextDir, img.name));
      fs.copyFileSync(path.join(nextDir, img.name), path.join(reactDir, img.name));
      const size = fs.statSync(path.join(nextDir, img.name)).size;
      console.log(`  ✓ Saved (${size} bytes)\n`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}\n`);
    }
  }
  console.log("All done!");
}

run();
