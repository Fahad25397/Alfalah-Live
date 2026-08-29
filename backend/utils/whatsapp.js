const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

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

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: './.wwebjs_auth' // stores auth data in this directory
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
  console.log('Please scan the QR code below using the WhatsApp app on your phone (Linked Devices):');
  qrcode.generate(qr, { small: true });
  console.log('======================================================\n');
  
  // Save QR code to a file so the AI can read it and display it
  try {
    fs.writeFileSync('qr.txt', qr);
  } catch (e) {
    console.error('Failed to write qr.txt');
  }
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

// Initialize the client
const initWhatsApp = () => {
  console.log('Starting WhatsApp Client...');
  client.initialize().catch(err => {
    console.error('Failed to initialize WhatsApp Client:', err);
  });
};

// Function to send a message
const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!isReady) {
      console.log('⚠️ WhatsApp Client is not ready yet. Cannot send message.');
      return false;
    }
    
    // Clean the phone number (remove +, spaces, dashes)
    let cleanNumber = to.replace(/[\s\-\+]/g, '');
    
    // Assume Pakistani number if it starts with 0 (e.g. 0300...)
    if (cleanNumber.startsWith('0') && cleanNumber.length === 11) {
      cleanNumber = '92' + cleanNumber.substring(1);
    }
    
    // 'to' should be in the format '923001234567@c.us'
    const chatId = `${cleanNumber}@c.us`;
    await client.sendMessage(chatId, message);
    console.log(`✅ WhatsApp message successfully sent to ${cleanNumber}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send WhatsApp message to ${to}:`, error);
    return false;
  }
};

module.exports = {
  initWhatsApp,
  sendWhatsAppMessage,
  client
};
