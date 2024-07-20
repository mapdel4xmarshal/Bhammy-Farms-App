const { parse } = require('node-html-parser');
const client = require('../../whatsapp');

class Controller {
  constructor() {
    this.GROUP_NAME = 'BHAMMY FARMS - ALERTS';
    this._groupId = null;
  }

  async processPaymentNotifications(notifications = []) {
    const payments = notifications.map((notification) => {
      const notificationRoot = parse(notification);
      const payment = {};
      notificationRoot.querySelector('td table').removeWhitespace().childNodes.map((node) => {
        payment[node.firstChild.text] = node.lastChild.text;
      });

      return payment;
    });

    const groupId = this._groupId || await this.getGroupByName(this.GROUP_NAME);
    const messages = [];

    for (const payment of payments) {
      const message = `*CREDIT ALERT*\nAccount Name: ${payment['Account Name']}\nAmount: ${
        payment['Transaction Currency']}${payment['Transaction Amount']}\nNarration: ${
        payment['Transaction Narration']}\nDate and Time: ${payment['Date and Time']}`;

      if (groupId) {
        client.sendMessage(groupId.groupMetadata.id._serialized, message);
        messages.push(message);
      }
    }

    return messages;
  }

  getGroupByName(groupName, skipCache) {
    return new Promise((resolve) => {
      client.getChats();
      client.once('getChats', (chats) => {
        const chat = chats.find((cht) => cht.isGroup && (cht.name === groupName));
        if (!skipCache) this._groupId = chat;
        resolve(chat);
      });
    });
  }

  async processWhatsappNotifications(payload) {
    const groupId = await this.getGroupByName(payload.group, true);
    client.sendMessage(groupId.groupMetadata.id._serialized, payload.message);

    return payload;
  }

  async processWhatsappWebhook(payload) {
    const groupId = await this.getGroupByName(payload.group, true);
    console.log(groupId, payload);

    return payload;
  }
}

module.exports = new Controller();
