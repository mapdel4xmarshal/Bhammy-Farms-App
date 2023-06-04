const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const Debugger = require('../utilities/debugger');

const debug = new Debugger('WhatsApp');
const SESSION_FILE_PATH = path.resolve(path.join(__dirname, 'session.json'));

let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

class WhatsApp {
  constructor() {
    this._client = null;
    this.queue = [];
    this.OK = false;
    // clean up listeners
    process.on('beforeExit', async () => {
      await this.cleanup();
      process.exit();
    });

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL',
      'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach((eventType) => {
      process.on(eventType, async () => {
        await this.cleanup();
        process.exit();
      });
    });
  }

  get client() {
    return this._client;
  }

  sendMessage(chatId, message) {
    if (this.OK) {
      this._client.sendMessage(chatId, message);
    } else this.queue.push({ chatId, message });
  }

  async initialize() {
    this._client = new Client({
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
          '--disable-gpu',
          '--start-maximized',
          '--no-default-browser-check',
          '--disable-infobars',
          '--disable-web-security',
          '--disable-site-isolation-trials',
          '--no-experiments',
          '--enable-features=NetworkService',
        ],
        executablePath: '/usr/bin/chromium' // '/opt/homebrew/bin/chromium'
      },
      session: sessionCfg
    });
    debug.info('Initialize whatsapp', 'OK');
    this._client.initialize();
    this.registerHandlers();
  }

  async destroy() {
    this.OK = false;
    debug.info('Destroy whatsapp', 'OK');
    return this._client && this._client.destroy();
  }

  async cleanup() {
    debug.info('Cleanup', 'Closing client due to process exit');
    try {
      this._client && await this._client.destroy();
    } catch (e) {
      debug.error('Cleanup Error', e);
    }
    this.OK = false;
  }

  registerHandlers() {
    this._client.on('ready', () => {
      this.OK = true;
      debug.info('QUEUE Operations', `${this.queue.length} task in queue.`);
      if (this.queue.length > 0) {
        this.queue.forEach((task) => {
          this._client.sendMessage(task.chatId, task.message);
        });
        this.queue = [];
      }
    });

    this._client.on('qr', (qr) => {
      // NOTE: This event will not be fired if a session is specified.
      debug.info('QR RECEIVED', qr);
      qrcode.generate(qr, { small: true });
    });

    this._client.on('authenticated', (session) => {
      debug.info('AUTHENTICATED', session);
      sessionCfg = session;
      fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
          debug.error('Session File', err);
        }
        this.OK = true;
      });
    });

    this._client.on('disconnected', () => {
      this.OK = false;
    });

    this._client.on('auth_failure', (msg) => {
      this.OK = false;
      // Fired if session restore was unsuccessfull
      debug.error('AUTHENTICATION FAILURE', msg);
    });
  }
}

module.exports = new WhatsApp();
