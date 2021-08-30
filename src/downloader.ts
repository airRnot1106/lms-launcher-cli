import puppeteer from 'puppeteer-core';
import fs from 'fs';
import propertiesReader from 'properties-reader';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import clui from 'clui';
import { Caution, Cipher } from './index';
import { IFunc } from './iFunc';

export default class Login implements IFunc {
  private caution: Caution;
  private cipher: Cipher;
  private _properties: propertiesReader.Reader;
  constructor() {
    this.caution = new Caution();
    this.cipher = new Cipher();
    if (!fs.existsSync(__dirname + '/config.ini')) {
      this.caution.toString(
        new Error(
          'Config file not found. Please execute the config command first'
        )
      );
    }
    this._properties = propertiesReader(__dirname + '/config.ini');
  }
  async excute() {
    console.log('> Login <');
    const username = <string>this._properties.get('loginData.username');
    const encryptedPassword = <string>(
      this._properties.get('loginData.password')
    );
    const password = this.cipher.decrypt(encryptedPassword);

    const Spinner = clui.Spinner;
    const spinner = new Spinner('Now logging in... ', [
      '⣾',
      '⣽',
      '⣻',
      '⢿',
      '⡿',
      '⣟',
      '⣯',
      '⣷',
    ]);
    spinner.start();

    const browser = await puppeteer.launch({
      channel: 'chrome',
      headless: false,
    });
    const page = (await browser.pages())[0] || (await browser.newPage());
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('https://tlms.tsc.u-tokai.ac.jp/login/index.php');
    await page.type('#username', username);
    await page.type('#password', password);
    await Promise.all([page.waitForNavigation(), page.click('#loginbtn')]);
    if (await page.$('.alert-danger')) {
      this.caution.toString(
        new Error('Not a valid account name or password'),
        'Login Error'
      );
    }
    spinner.stop();
    console.log(chalk.greenBright('> Login succeeded'));
    await page.goto('https://tlms.tsc.u-tokai.ac.jp/my/');
    while (1) {
      const isClose = readlineSync.keyInYNStrict(
        chalk.bold('Do you want to close your browser?')
      );
      if (isClose) {
        break;
      }
    }
  }
}
