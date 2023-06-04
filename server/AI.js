/* import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: "org-VUAXlXCbRt5FNpDOlPkW4IJE",
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.listEngines();
console.log(response.data);
const cv = await openai.createCompletion({ model: 'davinci', prompt: 'Write a resume for a new computer science graduate' });
console.log(cv.data); */

import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-VUAXlXCbRt5FNpDOlPkW4IJE',
});
const openai = new OpenAIApi(configuration);

openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'write a 2000 words and 5 chapter article on immigration' }],
}).then((completion) => {
  console.log('completion.data.choices[0].message', completion.data.choices[0].message.content);

  fs.writeFile('immigration article.txt', completion.data.choices[0].message.content, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
    console.log('done');
  });
});
