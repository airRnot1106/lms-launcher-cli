import puppeteer from 'puppeteer-core';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser } from '../../index';
import { IFunc } from '../../iFunc';

export default class ClassSearcher implements IFunc {
  async execute() {
    return await this.searchClass();
  }
  private async searchClass() {
    let className = '';
    const classNames: string[] = [];
    const parent = await Browser.page?.$('div.card-deck');
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
}
