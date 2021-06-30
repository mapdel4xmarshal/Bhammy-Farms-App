const fs = require("fs");
const path = require('path');
const puppeteer = require('puppeteer');

let html = fs.readFileSync(path.resolve(path.join(__dirname, './report.html')), 'utf-8');

async function generatePDF() {
  // we are using headless mode
  const browser = await puppeteer.launch();
  const page = await browser.newPage()
// We set the page content as the generated html by handlebars
  await page.setContent(html, {
    waitUntil: 'networkidle2',
  });
// We use pdf function to generate the pdf in the same folder as this file.
  await page.pdf({ path: 'invoice.pdf', format: 'A4' })
  await browser.close();
}

generatePDF();
