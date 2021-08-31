import puppeteer from 'puppeteer-core';
import fs from 'fs';
import propertiesReader from 'properties-reader';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import clui from 'clui';
import { Caution, Cipher } from './index';
import { IFunc } from './iFunc';

type TargetSection = {
  index: number;
  id: string;
};

type Resource = {
  element: puppeteer.ElementHandle<Element>;
  name: string;
};

export default class Downloader implements IFunc {
  private caution: Caution;
  private cipher: Cipher;
  private _properties: propertiesReader.Reader;
  private browser: puppeteer.Browser | undefined;
  private page: puppeteer.Page | undefined;
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
    this.browser = undefined;
    this.page = undefined;
  }
  async excute() {
    await this.login();
    const classNames = <string[]>await this.searchClass();
    await this.selectClass(classNames);
    await this.selectSection();
    const downloadQueue = <Resource[]>await this.selectResource();
    for (let resource of downloadQueue) {
      await this.download(resource);
    }
    console.log(
      chalk.greenBright.bold.bgGray('\n> All downloads are complete\n')
    );
  }

  private async login() {
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

    this.browser = await puppeteer.launch({
      channel: 'chrome',
      headless: true,
    });
    this.page =
      (await this.browser.pages())[0] || (await this.browser.newPage());
    await this.page.setViewport({ width: 1280, height: 800 });
    await this.page.goto('https://tlms.tsc.u-tokai.ac.jp/login/index.php');
    await this.page.type('#username', username);
    await this.page.type('#password', password);
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click('#loginbtn'),
    ]);
    if (await this.page.$('.alert-danger')) {
      this.caution.toString(
        new Error('Not a valid account name or password'),
        'Login Error'
      );
    }
    await this.page.goto('https://tlms.tsc.u-tokai.ac.jp/my/');
    await this.page.waitForTimeout(2000);
    spinner.stop();
    console.log(chalk.greenBright('> Login succeeded'));
  }
  private async searchClass() {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    let className = '';
    const classNames: string[] = [];
    const parent = await this.page.$('div.card-deck');
    let element: puppeteer.ElementHandle<Element>[] | undefined;
    while (1) {
      while (1) {
        className = readlineSync.question(chalk.bold('Enter class name: '));
        if (className) {
          break;
        }
        console.log(chalk.yellow('Enter is required'));
      }
      element = await parent?.$x(`.//span[contains(text(), "${className}")]`);
      if (element?.length) {
        break;
      }
      console.log(chalk.yellow('Classes not found'));
    }
    for (let i = 0; i < element!.length; i++) {
      const name = await element![i].getProperty('textContent');
      if (!name) {
        continue;
      }
      const data: string = await name.jsonValue();
      if (data.match(/現在のコースへのアクション/)) {
        continue;
      }
      classNames.push(data);
    }
    for (let i = 0; i < classNames.length; i++) {
      classNames[i] = classNames[i].replace(/\n */g, '');
    }
    return classNames;
  }

  private async selectClass(classNames: string[]) {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    let targetClass: string;
    if (classNames.length === 1) {
      console.log(
        chalk.greenBright('Class found: ') + chalk.white(classNames[0])
      );
      targetClass = classNames[0];
    } else {
      console.log(chalk.greenBright('Classes found: '));
      const index = readlineSync.keyInSelect(
        classNames,
        chalk.bold('Which classes?'),
        { cancel: false }
      );
      targetClass = classNames[index];
    }
    const parent = await this.page.$('div.card-deck');
    const element = await parent?.$x(
      `.//span[contains(text(), "${targetClass}")]`
    );
    if (!element?.length) {
      this.caution.toString(
        new Error('An invalid parameter was specified'),
        'Fatal Error'
      );
    }
    await Promise.all([this.page.waitForNavigation(), element![0].click()]);
  }

  private async selectSection() {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    const parent = await this.page.$('#region-main');
    const li = await parent!.$$('li.section');
    const classLength = li.length;
    const classLengthArray: string[] = [];
    for (let i = 0; i < classLength; i++) {
      classLengthArray.push(`第${i.toString(10).padStart(2, '0')}回`);
    }
    const index = readlineSync.keyInSelect(
      classLengthArray,
      chalk.bold('Which sections?'),
      { cancel: false }
    );
    const targetSection: TargetSection = {
      index: index,
      id: `#section-${index}`,
    };
    if (targetSection.index > 0) {
      const parent = await this.page.$(targetSection.id);
      const element = await parent?.$('.section-title');
      const href = await element!.$('a');
      await Promise.all([this.page.waitForNavigation(), href?.click()]);
    }
  }

  private async selectResource() {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    const parent = await this.page.$('#region-main');
    const resources = await parent!.$$('li.resource');
    if (!resources.length) {
      console.log(chalk.yellow('Resources not found'));
      console.log(chalk.underline('Stop.'));
      process.exit(0);
    }
    const resourceArray: Resource[] = [];
    for (let resource of resources) {
      const instanceNameElement = await resource.$('span.instancename');
      const instancename = <string>(
        await (
          await instanceNameElement!.getProperty('textContent')
        )?.jsonValue()
      );
      const resourceData: Resource = {
        element: resource,
        name: instancename.substring(0, instancename.indexOf(' ')),
      };
      resourceArray.push(resourceData);
    }
    const names: string[] = [];
    for (let resource of resourceArray) {
      names.push(resource.name);
    }
    const downloadQueue: Resource[] = [];
    while (1) {
      const index = readlineSync.keyInSelect(
        names,
        chalk.bold('Which resources?')
      );
      if (index === -1) {
        break;
      }
      downloadQueue.push(resourceArray[index]);
      console.log(
        chalk.green(`> Added ${resourceArray[index].name} to the queue`)
      );
      const isContinue = readlineSync.keyInYNStrict(
        chalk.bold('Do you want to download other resources?')
      );
      if (!isContinue) {
        break;
      }
    }
    return downloadQueue;
  }

  private async download(resource: Resource) {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    const dir_home =
      process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
    const dir_desktop = require('path').join(dir_home, 'Downloads');
    const downloadPath = dir_desktop;
    const client = await this.page.target().createCDPSession();
    client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadPath,
    });
    const link = await resource.element.$('.aalink');
    await link?.click();
    await this.waitDownloadComplete(downloadPath);
    console.log(chalk.greenBright(`> ${resource.name} download has completed`));
  }

  private async waitDownloadComplete(downloadPath: string) {
    const Spinner = clui.Spinner;
    const spinner = new Spinner('Now downloading... ', [
      '⣾',
      '⣽',
      '⣻',
      '⢿',
      '⡿',
      '⣟',
      '⣯',
      '⣷',
    ]);
    const isDownloadComplete = (path: string) => {
      const files = fs.readdirSync(path);
      for (let file of files) {
        if (/.*\.crdownload$/.test(file)) {
          return false;
        }
      }
      return true;
    };
    return new Promise<void>((resolve, reject) => {
      const wait = async (path: string) => {
        setTimeout(() => {
          if (isDownloadComplete(path)) {
            spinner.stop();
            resolve();
          } else {
            wait(path);
          }
        }, 1000);
      };
      spinner.start();
      wait(downloadPath);
    });
  }
}
