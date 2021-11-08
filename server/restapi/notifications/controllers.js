const { parse } = require('node-html-parser');
const client = require('../../whatsapp');

class Controller {
  constructor() {
    this.GROUP_NAME = 'BHAMMY FARMS - SALES';
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

    const groupId = await this.getGroupByName(this.GROUP_NAME);
    const messages = [];

    for (const payment of payments) {
      const message = `*CREDIT ALERT*\nAccount Name: ${payment['Account Name']}\nAmount: ${
        payment['Transaction Currency']}${payment['Transaction Amount']}\nNarration: ${
        payment['Transaction Narration']}\nDate and Time: ${payment['Date and Time']}`;

      if (groupId) {
        await client.sendMessage(groupId.groupMetadata.id._serialized, message);
        messages.push(message);
      }
    }

    return messages;
  }

  getGroupByName(groupName) {
    return client.getChats()
      .then((chats) => {
        return chats.find((chat) => chat.isGroup && (chat.name === groupName));
      });
  }
}

module.exports = new Controller();
