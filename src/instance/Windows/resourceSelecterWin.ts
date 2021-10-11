import puppeteer from 'puppeteer-core';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser } from '../../index';
import { IFunc } from 'iFunc';

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

type ValidType = 'resource' | 'folder';

type Resource = {
  element: puppeteer.ElementHandle<Element>;
  name: string;
  type: ValidType;
};

export default class resourceSelecterWin implements IFunc {
  async execute() {
    return await this.selectResource();
  }
  private async selectResource() {
    const parent = await Browser.page?.$('#region-main');
    const resources = await parent!.$$('li.resource, li.folder');
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
        type: <ValidType>resource._remoteObject.description?.split('.')[2],
      };
      resourceArray.push(resourceData);
    }

    const resourceNames: string[] = [];
    for (let i = 0; i < resourceArray.length; i++) {
      resourceNames.push(resourceArray[i].name);
      console.log(`[${keys[i]}] ${resourceArray[i].name.toString()}`);
    }
    console.log('[0] CANCEL');
    console.log('');

    const downloadQueue: Resource[] = [];
    while (1) {
      let index: number = 100;
      while (1) {
        const key = readlineSync.question(chalk.bold('Which resources?: '), {
          limit: /^[123456789abcdefghijklmnopqrstuvwxyz0]{1}$/i,
          limitMessage: chalk.yellow('Please enter the correct key'),
        });
        if (key == '0') {
          index = -1;
          break;
        }
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
        chalk.green(
          `> Added ${resourceArray[index].name.toString()} to the queue`
        )
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
}
