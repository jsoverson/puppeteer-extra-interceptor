const { PuppeteerExtraPlugin } = require('puppeteer-extra-plugin')
const { intercept, patterns } = require('puppeteer-interceptor');

class InterceptorPlugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts)
  }

  get name() {
    return 'puppeteer-extra-interceptor'
  }

  async afterLaunch(browser) {
    const pages = await browser.pages();
    pages.forEach(p => p.intercept = p.intercept || function(requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    })
  }

  async afterConnect(browser) {
    const pages = await browser.pages();
    pages.forEach(p => p.intercept = p.intercept || function(requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    })
  }

  async onPageCreated(page) {
    console.log('page created');
    page.intercept = function(requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    };
  }
}

exports.interceptor = function(pluginConfig) {
  return new InterceptorPlugin(pluginConfig)
}

exports.patterns = patterns;
