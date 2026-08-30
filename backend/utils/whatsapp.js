const fs = require('fs');

const isVercel = process.env.VERCEL === '1';

let initWhatsApp = () => {
  console.log('WhatsApp Bot is disabled on Vercel.');
};

let sendWhatsAppMessage = async (to, message) => {
  console.log('WhatsApp Bot is disabled on Vercel. Message not sent:', message);
  return false;
};

let client = null;

if (!isVercel) {
  try {
    const req = eval('require');
    const { Client, LocalAuth } = req('whatsapp-web.js');
    const qrcode = req('qrcode-terminal');

    // Common paths for Chrome/Edge on Windows
    const executablePaths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];

    let executablePath = undefined;
    for (const path of executablePaths) {
      if (fs.existsSync(path)) {
        executablePath = path;
        break;
      }
    }

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
      }),
      puppeteer: {
        executablePath: executablePath,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    let isReady = false;

    client.on('qr', (qr) => {
      console.log('\n======================================================');
      console.log('📱 WhatsApp Authentication Required!');
      qrcode.generate(qr, { small: true });
      console.log('======================================================\n');
      try { fs.writeFileSync('qr.txt', qr); } catch (e) {}
    });

    client.on('ready', () => {
      console.log('✅ WhatsApp Client is ready and authenticated!');
      isReady = true;
    });

    client.on('authenticated', () => {
      console.log('✅ WhatsApp authentication successful!');
    });

    client.on('auth_failure', (msg) => {
      console.error('❌ WhatsApp authentication failed:', msg);
    });

    client.on('disconnected', (reason) => {
      console.log('❌ WhatsApp Client was disconnected:', reason);
      isReady = false;
    });

    initWhatsApp = () => {
      console.log('Starting WhatsApp Client...');
      client.initialize().catch(err => {
        console.error('Failed to initialize WhatsApp Client:', err);
      });
    };

    sendWhatsAppMessage = async (to, message) => {
      try {
        if (!isReady) {
          console.log('⚠️ WhatsApp Client is not ready yet.');
          return false;
        }
        let cleanNumber = to.replace(/[\s\-\+]/g, '');
        if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
          cleanNumber = '92' + cleanNumber.substring(1);
        }
        const chatId = `${cleanNumber}@c.us`;
        await client.sendMessage(chatId, message);
        console.log(`✅ WhatsApp message successfully sent to ${cleanNumber}`);
        return true;
      } catch (error) {
        console.error(`❌ Failed to send WhatsApp message to ${to}:`, error);
        return false;
      }
    };
  } catch (err) {
    console.error('Failed to initialize local WhatsApp module', err);
  }
}

module.exports = {
  initWhatsApp,
  sendWhatsAppMessage,
  client
};
