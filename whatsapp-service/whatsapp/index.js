const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client,  } = require('whatsapp-web.js');
const Debugger = require('../utilities/debugger');

const debug = new Debugger('WhatsApp');
const SESSION_FILE_PATH = path.resolve(path.join(__dirname, 'session.json'));

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--enable-low-end-device-mode',
      '--process-per-site',
      '--single-process',
      '--disable-site-isolation-trials',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-breakpad',
      '--disable-client-side-phishing-detection',
      '--disable-default-apps',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-sync',
      '--disable-translate',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--headless',
      '--hide-scrollbars',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--ignore-ssl-errors',
      '--metrics-recording-only',
      '--mute-audio',
      '--no-first-run',
      '--safebrowsing-disable-auto-update',
      '--disable-gpu'
    ],
    executablePath: '/opt/homebrew/bin/chromium'
  },
  session: sessionCfg
});

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  debug.info('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('authenticated', (session) => {
  debug.info('AUTHENTICATED', session);
  sessionCfg = session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
    if (err) {
      debug.error(err);
    }
  });
});

client.on('auth_failure', (msg) => {
  // Fired if session restore was unsuccessfull
  debug.error('AUTHENTICATION FAILURE', msg);
});

const cleanup = async () => {
  debug.info('Cleanup', 'Closing client due to process exit');
  try {
    client.destroy();
  } catch (e) {
    debug.error(e);
  }
};

// clean up listeners
process.on('beforeExit', async () => {
  await cleanup();
  process.exit();
});
process.on('uncaughtException', async (e) => {
  await cleanup();
  debug.error('Whatapp Exception', e);
  process.exit();
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL',
  'SIGTRAP', 'SIGABRT',
  'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
  process.on(eventType, async () => {
    await cleanup();
    process.exit();
  });
});

module.exports = client;
