import { Browser, Page } from 'puppeteer';
import { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import { intercept, Interceptor } from 'puppeteer-interceptor';
import Protocol from "devtools-protocol";

export { Interceptor } from 'puppeteer-interceptor';
export { Protocol as DevtoolProtocol } from 'devtools-protocol';

export { patterns } from 'puppeteer-interceptor';

declare module 'puppeteer' {
  export interface Page {
    intercept(patterns: Protocol.Fetch.RequestPattern[], eventHandlers: Interceptor.EventHandlers): void;
  }
}

class InterceptorPlugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts);
    this.debug('interceptor initialized');
  }

  async afterConnect(browser: Browser) {
    const [page] = await browser.pages();
    if (!page.intercept) page.intercept = function (requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    };
  }

  async afterLaunch(browser: Browser) {
    const [page] = await browser.pages();
    if (!page.intercept) page.intercept = function (requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    };
  }

  async onPageCreated(page:Page) {
    if (!page.intercept) page.intercept = function (requestPatterns, handlers) {
      intercept(this, requestPatterns, handlers);
    };
  }

  get name() {
    return 'puppeteer-extra-plugin-interceptor';
  }
}

export function interceptor(pluginConfig = {}) {
  return new InterceptorPlugin(pluginConfig);
}
