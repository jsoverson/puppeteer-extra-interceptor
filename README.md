# puppeteer-extra-plugin-interceptor

A puppeteer-extra plugin that simplifies request interception and response modification.

## Status : Experimental

The underlying APIs in the Chrome Devtools Protocol are all labeled "Experimental" so this plugin should be considered experimental as well.

## Who is this for

- Developers troubleshooting in production
- QA Engineers
- Reverse Engineers
- Penetration Testers

## Documentation

Please see [puppeteer-interceptor](http://github.com/jsoverson/puppeteer-interceptor). This is just a wrapper to use with puppeteer-extra's plugin system.

## Installation

```shell
$ npm install puppeteer-extra-plugin-interceptor
```

## Usage

```js
const puppeteer = require('puppeteer-extra');
const { interceptor, patterns } = require('puppeteer-extra-plugin-interceptor');

puppeteer.use(interceptor());

(async function main(){
  const browser = await puppeteer.launch();

  const [ page ] = await browser.pages();

  page.intercept(patterns.Script('*'), { onResponseReceived: (response) => {
    console.log(`Response is ${response.body} bytes`);
  }});

})()
```

## Example

This example uses Prettier to automatically intercept and prettify all JavaScript.

```js
const puppeteer = require('puppeteer-extra');
const { interceptor, patterns } = require('puppeteer-extra-plugin-interceptor');

puppeteer.use(interceptor());

const prettier = require('prettier');

function transform(response) {
  response.body = prettier.format(response.body, {parser:'babel'});
  return response;
}

(async function main(){
  const browser = await puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args: ['--window-size=1920,1170','--window-position=0,0']
  });

  const [ page ] = await browser.pages();

  page.intercept(patterns.Script('*'), {onResponseReceived: transform});

  // intercept URLs in new tabs
  browser.on('targetcreated', async (target) => {
    const page = await target.page();
    if (page) page.intercept(urlPatterns, transform);
  });

})()
```