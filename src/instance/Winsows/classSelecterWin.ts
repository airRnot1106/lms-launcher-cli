import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser, Caution, Prompter } from '../../index';
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

export default class ClassSelecterWin implements IFunc {
  async execute(classNames: string[]) {
    await this.selectClass(classNames);
  }
  private async selectClass(classNames: string[]) {
    let targetClass: string;
    if (classNames.length === 1) {
      console.log(
        chalk.greenBright('Class found: ') +
          chalk.white(classNames[0].toString())
      );
      console.log('');
      targetClass = classNames[0];
    } else {
      console.log(chalk.greenBright('Classes found: '));
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
      console.log('');
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
