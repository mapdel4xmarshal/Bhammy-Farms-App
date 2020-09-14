const request = require('request');

class Notification {
  constructor() {
    this._pushUrl = 'https://onesignal.com/api/v1/notifications';
  }

  send(title, message, url) {
    if (process.env.NODE_ENV !== 'production') return;
    request.post({
      url: this._pushUrl,
      body: JSON.stringify({
        app_id: "cde66a1f-9189-49f9-9233-464f50da1cf6",
        contents: { "en": message },
        headings: { "en": `Bhammy Farms - ${title}` },
        included_segments: ["All"],
        url: `https://admin.bhammyfarms.com/${ url }`
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': 'Basic MWUyNmNlZGUtMWNiZi00ZDZmLWJiOWMtMzBlOWJkOWQ0MDVj'
      }
    }, (err) => {
      if (err) console.log(err);
    });
  }
}

module.exports = Notification;
