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

const client = new Client({ puppeteer: { headless: true, args: ['--no-sandbox'] }, session: sessionCfg });

if (process.env.NODE_ENV === 'production')  client.initialize();

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  debug.info('QR RECEIVED', qr);
  qrcode.generate(qr, {small: true});
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

client.on('ready', () => {
  debug.info('READY');
});

client.on('message', async (msg) => {
  if (msg.body === '!ping reply') {
    // Send a new message as a reply to the current one
    msg.reply('pong');
  } else if (msg.body === '!ping') {
    // Send a new message to the same chat
    client.sendMessage(msg.from, 'pong');
  }
});

client.on('message_create', (msg) => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
    debug.info('message_create', msg);
  }
});

client.on('message_revoke_everyone', async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  debug.info('message_revoke_everyone - after', after); // message after it was deleted.
  if (before) {
    debug.info('message_revoke_everyone - before', before); // message before it was deleted.
  }
});

client.on('message_revoke_me', async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  debug.info('message_revoke_me', msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
  /*
      == ACK VALUES ==
      ACK_ERROR: -1
      ACK_PENDING: 0
      ACK_SERVER: 1
      ACK_DEVICE: 2
      ACK_READ: 3
      ACK_PLAYED: 4
  */

  console.log('message_ack', msg, ack);

  if (ack == 3) {
    // The message was read
  }
});

client.on('group_join', (notification) => {
  // User has joined or been added to the group.
  debug.info('join', notification);
  notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
  // User has left or been kicked from the group.
  debug.info('leave', notification);
  notification.reply('User left.');
});

client.on('group_update', (notification) => {
  // Group picture, subject or description has been updated.
  debug.info('update', notification);
});

client.on('change_battery', (batteryInfo) => {
  // Battery percentage for attached device has changed
  const { battery, plugged } = batteryInfo;
  debug.info(`Battery: ${battery}% - Charging? ${plugged}`);
});

client.on('change_state', (state) => {
  debug.info('CHANGE STATE', state);
});

client.on('disconnected', (reason) => {
  debug.info('Client was logged out', reason);
});

const cleanup = async () => {
  debug.info('Cleanup', 'Closing client due to process exit');
  try {
    await client.destroy();
  } catch (e) {
    debug.error(e);
  }
}

// clean up listeners
process.on('beforeExit', async () => {
  await cleanup();
  process.exit();
});
process.on('uncaughtException', async () => {
  await cleanup();
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
