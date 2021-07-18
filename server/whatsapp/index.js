const fs = require('fs');
const Debugger  = require('../utilities/debugger');
const { Client } = require('whatsapp-web.js');

const debug = new Debugger('WhatsApp');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

client.initialize();

client.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  debug.info('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
  debug.info('AUTHENTICATED', session);
  sessionCfg=session;
  fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
    if (err) {
      debug.error(err);
    }
  });
});

client.on('auth_failure', msg => {
  // Fired if session restore was unsuccessfull
  debug.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
  debug.info('READY');
});

client.on('message', async msg => {
  if (msg.body === '!ping reply') {
    // Send a new message as a reply to the current one
    msg.reply('pong');

  } else if (msg.body === '!ping') {
    // Send a new message to the same chat
    client.sendMessage(msg.from, 'pong');
  }

  let chat = await msg.getChat();
  if (chat.isGroup) {
    let eventName = chat.name;

    if (chat.name === 'Bhammy Farms - Feed Mill' || (chat.name.includes('Feed') && chat.name.includes('Bhammy'))){
      eventName = 'feedProduction';
    }
    client.emit(eventName, msg);
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

client.on('change_state', state => {
  debug.info('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
  debug.info('Client was logged out', reason);
});

module.exports = client;
