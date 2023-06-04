const request = require('request');
const client = require('../whatsapp');
const Debug = require('../utilities/debugger');

const debug = new Debug('WeatherMonitor:Bot');

class WeatherMonitor {
  constructor(frequency = 120) {
    this.GROUP_NAME = 'Bhammy Farms - Oloko';
    this._groupId = null;
    this._timerId = null;
    this._frequency = frequency;
  }

  monitor(frequency = this._frequency) {
    this._frequency = +frequency;
    debug.info('WeatherMonitor', `Started!, ${frequency}`);
    if (!this._timerId) {
      this._timerId = setInterval(() => {
        this.autoProcess();
      }, 60000);
    }
  }

  stop() {
    if (this._timerId) clearInterval(this._timerId);
  }

  autoProcess() {
    const minutes = new Date().getMinutes();
    debug.info('AutoProcess triggered', `${minutes} ${minutes % this._frequency}`);
    if (minutes % this._frequency === 0) {
      debug.info('AutoProcess', 'On mark!');
      this.processReport();
    }
  }

  async getWeatherInfo() {
    return new Promise((resolve) => {
      request.get('http://api.weatherapi.com/v1/current.json?key=aa5f3c747bb140be95f230031202507&q=ilorin&aqi=no', (error, resp, data) => {
        if (error) {
          debug.info('Weather Error', error);
          resolve({ error });
        } else {
          const weather = JSON.parse(data);
          const payload = { temp: +weather.current.temp_c, humidity: +weather.current.humidity };
          debug.info('Weather result', payload);
          resolve(payload);
        }
      });
    });
  }

  _getGroupByName(groupName) {
    return new Promise((resolve) => {
      client.getChats();
      client.once('getChats', (chats) => {
        const chat = chats.find((cht) => cht.isGroup && (cht.name === groupName));
        this._groupId = chat;
        debug.info('getChats', chats);
        resolve(chat);
      });
    });
  }

  async _sendNotification(message) {
    const groupId = this._groupId || await this._getGroupByName(this.GROUP_NAME);
    debug.info('SendNotification', groupId);
    return client.sendMessage(groupId.groupMetadata.id._serialized, message);
  }

  processReport() {
    this.getWeatherInfo().then((weather) => {
      const heatIndex = this.heatIndex(weather.temp, weather.humidity);

      if (heatIndex >= 75) {
        const stressLevel = this.stressLevel(heatIndex);
        const recommendation = this.recommendations(heatIndex, weather.humidity);

        debug.info('processReport', { stressLevel, recommendation });
        // eslint-disable-next-line max-len
        this._sendNotification(`🛑 *HEAT STRESS - ${stressLevel.toUpperCase()}!*\nTemperature *${weather.temp}*\nHumidity *${weather.humidity}*\n\n*Recommendations*\n${recommendation}`);
      }
    });
  }

  heatIndex(temp, humidity) {
    const indexes = {
      20: [63, 63, 63, 64, 64, 64, 64, 65, 65, 65, 66, 66, 66, 66, 67, 67, 67, 67, 68, 68],
      22: [64, 65, 65, 66, 66, 66, 67, 67, 67, 68, 68, 69, 69, 69, 70, 70, 70, 71, 71, 72],
      24: [66, 67, 67, 68, 68, 69, 69, 70, 70, 70, 71, 71, 72, 72, 73, 73, 74, 74, 75, 75],
      26: [68, 69, 69, 70, 70, 71, 71, 72, 73, 73, 74, 74, 75, 75, 76, 77, 77, 78, 78, 79],
      28: [70, 70, 71, 72, 72, 73, 74, 74, 75, 76, 76, 77, 78, 78, 79, 80, 80, 81, 82, 82],
      30: [71, 72, 73, 74, 74, 75, 76, 77, 78, 78, 79, 80, 81, 81, 82, 83, 84, 84, 85, 86],
      32: [73, 74, 75, 76, 77, 77, 78, 79, 80, 81, 82, 83, 84, 84, 85, 86, 87, 88, 89, 90],
      34: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93],
      36: [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 93, 94, 95, 96, 97],
      38: [78, 79, 81, 82, 83, 84, 85, 86, 88, 89, 90, 91, 92, 93, 95, 96, 97, 98, 99, 100]
    };

    const rTemp = 2 * Math.round(temp / 2);
    const relativeTemp = Math.max(Math.min(rTemp, 38), 20);
    const rH = 5 * Math.round(humidity / 5);
    console.log('heatIndex', relativeTemp, rH, indexes[relativeTemp][(rH / 5) - 1]);
    return indexes[relativeTemp][(rH / 5) - 1];
  }

  stressLevel(heatIndex) {
    if (heatIndex < 70) return 'Ok';
    if (heatIndex < 75) return 'Alert';
    if (heatIndex < 81) return 'Danger';
    if (heatIndex > 81) return 'Emergency';
  }

  recommendations(heatIndex, humidity) {
    const recommendations = [];

    if (heatIndex >= 75) {
      recommendations.push('✔ Turn on fans');
      if (humidity < 71) {
        recommendations.push('✔ Turn on foggers');
      } else recommendations.push('✖ Turn off foggers');

      if (heatIndex > 81) {
        recommendations.push('✔ Flush drinking lines and pump fresh water.');
        recommendations.push('✔ Do not feed the birds');
      }
    }
    return recommendations.join('\n');
  }
}
module.exports = WeatherMonitor;
