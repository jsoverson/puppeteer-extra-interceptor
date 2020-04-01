const assert = require('assert');

const puppeteer = require('puppeteer-extra');

const { interceptor, patterns } = require('./index.js');

puppeteer.use(interceptor());

(async function(){

  const browser = await puppeteer.launch({});
  const [ page ] = await browser.pages();
  let a, b;

  page.intercept(patterns.All('*'), {
    onInterception: event => {
      a = 'onInterception'
    },
    onResponseReceived: event => {
      b = 'onResponseReceived';
    }
  });

  await page.goto(`http://example.com`);
  await browser.close();
  assert.equal(a, 'onInterception');
  assert.equal(b, 'onResponseReceived');
  
}())

