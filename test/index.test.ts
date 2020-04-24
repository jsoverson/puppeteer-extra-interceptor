import assert from 'assert';

import puppeteer from 'puppeteer-extra';

import { interceptor, patterns } from '../src';

puppeteer.use(interceptor());

describe('puppeteer-extra-plugin-interceptor', function () {
  it('should extend Page with intercept()', async function () {
    const browser = await puppeteer.launch({});
    const [page] = await browser.pages();
    let a, b;

    page.intercept(patterns.All('*'), {
      onInterception: (event) => {
        a = 'onInterception';
      },
      onResponseReceived: (event) => {
        b = 'onResponseReceived';
      },
    });

    await page.goto(`http://example.com`);
    await browser.close();
    assert.equal(a, 'onInterception');
    assert.equal(b, 'onResponseReceived');
    return browser.close();
  });
});
