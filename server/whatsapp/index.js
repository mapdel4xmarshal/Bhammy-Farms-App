#!/usr/bin/env node

const Debugger = require('../utilities/debugger');
const EventEmitter = require('events');
const WebSocketClient = require('websocket').client;

const debug = new Debugger('WhatsApp');
const client = new WebSocketClient();

class WhatsappClient extends EventEmitter {
  constructor() {
    super();
    this.connectWS();
    this.registerWsHandlers();
  }

  static replyMessage(connection, payload) {
    const response = {
      action: 'reply',
      message: payload.message,
      chatId: payload.chatId,
      messageId: payload.messageId
    };

    if (connection.connected) {
      connection.sendUTF(JSON.stringify(response));

      debug.info('Reply message', response);
    }
  }

  connectWS() {
    client.connect('ws://54.198.186.115:8000/', 'echo-protocol');
  }

  sendMessage(chatId, message) {
    this._connection.sendUTF(JSON.stringify({ action: 'sendMessage', chatId, message }));
  }

  getChats() {
    this._connection.sendUTF(JSON.stringify({ action: 'getChats' }));
  }

  registerWsHandlers() {
    const context = this;

    client.on('connectFailed', (error) => {
      debug.info('connectFailed', `Connect Error: ${error.toString()}`);
      setTimeout(context.connectWS, 5000);
    });

    client.on('connect', (connection) => {
      debug.info('connect::', 'WebSocket Client Connected');

      this._connection = connection;

      connection.on('error', (error) => {
        debug.info('Websocket error::', `Connection Error: ${error.toString()}`);
        context.emit('server_connection_error', error);
        setTimeout(context.connectWS, 5000);
      });

      connection.on('close', (reason) => {
        debug.info('Websocket close::', 'echo-protocol Connection Closed');
        context.emit('server_connection_close', reason);
        setTimeout(context.connectWS, 5000);
      });

      connection.on('message', (serverMessage) => {
        try {
          if (serverMessage.type === 'utf8') {
            const payload = JSON.parse(serverMessage.utf8Data);
            debug.info(`Received: '${serverMessage.utf8Data}'`);
            const { message } = payload;

            switch (payload.action) {
              case 'auth_failure': {
                debug.error('AUTHENTICATION FAILURE', message);
                context.emit('auth_failure', message);
                break;
              }
              case 'ready': {
                debug.info('READY');
                context.emit('ready');
                break;
              }
              case 'message_create':
              case 'message': {
                const messageId = message?.id?._serialized;
                const chatId = message?.chat?.groupMetadata?.id._serialized || message.chat.id._serialized;

                debug.info(payload.action, message);
                context.emit(payload.action, {
                  ...message,
                  reply: (msg) => WhatsappClient.replyMessage(connection, {
                    message: msg,
                    messageId,
                    chatId
                  })
                });
                break;
              }
              case 'message_revoke_everyone': {
                const messageId = message?.id?._serialized;
                const chatId = message?.after?.chat?.groupMetadata?.id._serialized || message?.after?.chat.id._serialized;

                debug.info('message_revoke_everyone - after', message.after); // message after it was deleted.
                if (message.before) {
                  debug.info('message_revoke_everyone - before', message.before); // message before it was deleted.
                }
                context.emit('message_revoke_everyone', {
                  ...message.after,
                  reply: (msg) => WhatsappClient.replyMessage(connection, {
                    message: msg,
                    messageId,
                    chatId
                  })
                },{
                  ...message.before,
                  reply: (msg) => WhatsappClient.replyMessage(connection, {
                    message: msg,
                    messageId,
                    chatId
                  })
                });
                break;
              }
              case 'message_revoke_me':
              case 'change_state':
              case 'change_battery': {
                debug.info(payload.action, message);
                context.emit(payload.action, {
                  ...message,
                  reply: (msg) => WhatsappClient.replyMessage(connection, msg)
                });
                break;
              }
              case 'disconnected': {
                context.emit('disconnected', message);
                debug.info('Client was logged out', message);
                break;
              }
              case 'getChats': {
                context.emit('getChats', payload.chats);
                debug.info('getChats', payload.chats);
                break;
              }
              default: debug.info(payload.action, payload.chats);
            }
          }
        } catch (e) {
          debug.error('Websocket Message error::', e);
        }
      });
    });
  }
}

module.exports = new WhatsappClient();
