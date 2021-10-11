import puppeteer from 'puppeteer-core';
import { Caution } from '../index';

export default abstract class Browser {
  private static _isValid = false;
  private static _browser: puppeteer.Browser | undefined = undefined;
  private static _page: puppeteer.Page | undefined = undefined;
  constructor() {}
  static async initialize(isHeadless: boolean) {
    this._browser = await puppeteer.launch({
      channel: 'chrome',
      headless: isHeadless,
    });
    this._page =
      (await this._browser.pages())[0] || (await this._browser.newPage());
    this._isValid = true;
  }
  static get browser() {
    if (!this._isValid) {
      Caution.toString(new Error('Browser is not initialized'), 'Fatal Error');
    }
    return this._browser;
  }
  static get page() {
    if (!this._isValid) {
      Caution.toString(new Error('Browser is not initialized'), 'Fatal Error');
    }
    return this._page;
  }
}
