import puppeteer from 'puppeteer-core';
import fs from 'fs';
import propertiesReader from 'properties-reader';
import readlineSync from 'readline-sync';
import readline from 'readline';
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

const keys = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

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
    const classNames = <string[]>await this.searchClassWin();
    await this.selectClassWin(classNames);
    await this.selectSectionWin();
    const downloadQueue = <Resource[]>await this.selectResourceWin();
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

  private async question(question: string) {
    const readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      readlineInterface.question(question, (answer: string) => {
        resolve(answer);
        readlineInterface.close();
      });
    });
  }
  private async prompt(msg: string) {
    console.log(msg);
    const answer = <string>await this.question('> ');
    return answer.trim();
  }

  private async searchClassWin() {
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
        className = await this.prompt(chalk.bold('Enter class name: '));
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

  private async selectClassWin(classNames: string[]) {
    if (!this.page) {
      this.caution.toString(new Error('Internal error.'), 'Fatal Error');
      return;
    }
    let targetClass: string;
    if (classNames.length === 1) {
      console.log(
        chalk.greenBright('Class found: ') +
          chalk.white(classNames[0].toString())
      );
      console.log('');
      targetClass = classNames[0];
    } else {
      console.log(chalk.greenBright('Classes found: \n'));
      for (let i = 0; i < classNames.length; i++) {
        console.log(`[${keys[i]}] ${classNames[i]}`);
      }
      console.log('');
      let index: number = 100;
      while (1) {
        const key = readlineSync.question(chalk.bold('Which classes?: '), {
          limit: /^[123456789abcdefghijklmnopqrstuvwxyz]{1}$/i,
          limitMessage: chalk.yellow('Please enter the correct key'),
        });
        index = keys.indexOf(key.toString());
        if (index <= classNames.length) {
          break;
        }
        console.log(chalk.yellow('Please enter the correct key'));
      }
      console.log('');
      targetClass = classNames[index];
      console.log(`${targetClass}: `);
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

  private async selectSectionWin() {
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
      console.log(`[${keys[i]}] ${classLengthArray[i]}`);
    }
    console.log('');
    let index: number = 100;
    while (1) {
      const key = readlineSync.question(chalk.bold('Which sections?: '), {
        limit: /^[123456789abcdefghijklmnopqrstuvwxyz]{1}$/i,
        limitMessage: chalk.yellow('Please enter the correct key'),
      });
      index = keys.indexOf(key.toString());
      if (index <= classLengthArray.length) {
        break;
      }
      console.log(chalk.yellow('Please enter the correct key'));
    }
    console.log('');
    console.log(`${classLengthArray[index]}: `);
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

  private async selectResourceWin() {
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
    for (let i = 0; i < resourceArray.length; i++) {
      names.push(resourceArray[i].name);
      console.log(`[${keys[i]}] ${resourceArray[i].name}`);
    }
    console.log('');
    const downloadQueue: Resource[] = [];
    while (1) {
      let index: number = 100;
      while (1) {
        const key = readlineSync.question(chalk.bold('Which resources?: '), {
          limit: /^[123456789abcdefghijklmnopqrstuvwxyz]{1}$/i,
          limitMessage: chalk.yellow('Please enter the correct key'),
        });
        index = keys.indexOf(key.toString());
        if (index <= resourceArray.length) {
          break;
        }
        console.log(chalk.yellow('Please enter the correct key'));
      }
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
