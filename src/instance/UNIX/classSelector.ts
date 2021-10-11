import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser, Caution } from '../../index';
import { IFunc } from 'iFunc';

export default class ClassSelecter implements IFunc {
  async execute(classNames: string[]) {
    await this.selectClass(classNames);
  }
  private async selectClass(classNames: string[]) {
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
      console.log('');
      console.log(`${targetClass}: `);
    }
    const parent = await Browser.page?.$('div.card-deck');
    const element = await parent?.$x(
      `.//span[contains(text(), "${targetClass}")]`
    );
    if (!element?.length) {
      Caution.toString(
        new Error('An invalid parameter was specified'),
        'Fatal Error'
      );
    }
    await Promise.all([Browser.page?.waitForNavigation(), element![0].click()]);
  }
}
