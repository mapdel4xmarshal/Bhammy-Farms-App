#!/usr/bin/env node

const WebSocketServer = require('websocket').server;
const http = require('http');
const uuid = require('uuid');
const Debugger = require('./utilities/debugger');
const whatsapp = require('./whatsapp');

const debug = new Debugger('WhatsApp-Server');
const port = process.env.NODE_PORT || 8000;
const connectedClients = [];

const broadCastMessage = (action, message) => {
  connectedClients.forEach((connection) => {
    if (connection.connected) {
      connection.sendUTF(JSON.stringify({ action, message }));
    }
  });
};

const server = http.createServer((request, response) => {
  debug.info('request', `${new Date()} Received request for ${request.url}`);
  response.writeHead(404);
  response.end();
});

server.listen(port, async () => {
  debug.info('Listen', `${new Date()} Server is listening on port ${port}`);

  await whatsapp.initialize();

  whatsapp.client.on('ready', () => {
    debug.info('READY');
    broadCastMessage('ready');
  });

  whatsapp.client.on('message', async (msg) => {
    if (msg.id.remote !== '2348073290177-1584291216@g.us') {
      debug.info('message', msg);
      const chat = await msg.getChat();
      broadCastMessage('message', { ...msg, chat });
    }
  });

  whatsapp.client.on('message_create', async (msg) => {
    if (msg.id.remote !== '2348073290177-1584291216@g.us') {
      // Fired on all message creations, including your own
      debug.info('message_create', msg);
      const chat = await msg.getChat();
      broadCastMessage('message_create', { ...msg, chat });
    }
  });

  whatsapp.client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    debug.info('message_revoke_everyone - after', after); // message after it was deleted.
    if (before) {
      debug.info('message_revoke_everyone - before', before); // message before it was deleted.
    }
    const chat = await after.getChat();
    broadCastMessage('message_revoke_everyone', { after: { ...after, chat }, before });
  });

  whatsapp.client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    debug.info('message_revoke_me', msg.body); // message before it was deleted.
    broadCastMessage('message_revoke_me', msg);
  });

  whatsapp.client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    debug.info(`Battery: ${battery}% - Charging? ${plugged}`);
    broadCastMessage('change_battery', batteryInfo);
  });

  whatsapp.client.on('change_state', (state) => {
    debug.info('CHANGE STATE', state);
    broadCastMessage('change_state', state);
  });

  whatsapp.client.on('disconnected', (reason) => {
    debug.info('Client was logged out', reason);
    broadCastMessage('disconnected', reason);
  });

  whatsapp.client.on('auth_failure', async () => {
    await whatsapp.destroy();
    await whatsapp.initialize();
  });

  setInterval(async () => {
    whatsapp.client.getWWebVersion()
      .then((version) => debug.info('HEARTBEAT', version))
      .catch(async () => {
        await whatsapp.destroy();
        await whatsapp.initialize();
      });
  }, 1 * 60 * 1000);
});

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed() {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', (request) => {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    debug.info('Connection rejection', `${new Date()} Connection from origin ${request.origin} rejected.`);
    return;
  }

  const connection = request.accept('echo-protocol', request.origin);
  debug.info('Accept connection', `${new Date()} Connection accepted.`);

  connection.id = uuid.v4();
  connectedClients.push(connection);

  connection.on('message', (message) => {
    if (message.type === 'utf8') {
      debug.info('Received Message:', message.utf8Data);
      let utf8Data;

      try {
        utf8Data = JSON.parse(message.utf8Data);
      } catch (e) {
        utf8Data = {};
        debug.error('Invalid payload', message.utf8Data);
      }

      switch (utf8Data.action) {
        case 'reply': {
          if (utf8Data.chatId) {
            whatsapp.client.getChatById(utf8Data.chatId).then(async (chat) => {
              const messages = await chat.fetchMessages({ limit: utf8Data.limit || 10 });
              const filteredMessage = messages.find((msg) => msg.id._serialized === utf8Data.messageId);
              if (filteredMessage) {
                await filteredMessage.reply(utf8Data.message);
                debug.info('Reply', utf8Data.message);
              } else {
                whatsapp.sendMessage(utf8Data.chatId, utf8Data.message);
              }
            });
          }
          break;
        }
        case 'getChats': {
          whatsapp.client.getChats().then((chats) => {
            debug.info('getChats', chats);
            connection.sendUTF(JSON.stringify({ action: 'getChats', chats }));
          });
          break;
        }
        case 'sendMessage': {
          whatsapp.sendMessage(utf8Data.chatId, utf8Data.message);
          debug.info('sendMessage', utf8Data);
          break;
        }
        default: debug.info('Unknown message action', utf8Data);
      }
    }
  });

  connection.on('close', (reasonCode, description) => {
    const index = connectedClients.findIndex((clientConnection) => clientConnection.id === connection.id);
    connectedClients.splice(index, 1);
    debug.info('close', `${new Date()} Peer ${connection.remoteAddress} disconnected.`, reasonCode, description);
  });
});
