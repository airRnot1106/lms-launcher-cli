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

type TargetSection = {
  index: number;
  id: string;
};

export default class SectionSelectorWin implements IFunc {
  async execute() {
    await this.selectSection();
  }
  private async selectSection() {
    const parent = await Browser.page?.$('#region-main');
    const li = await parent!.$$('li.section');
    const classLength = li.length;
    const classLengthArray: string[] = [];

    for (let i = 0; i < classLength; i++) {
      classLengthArray.push(`第${i.toString(10).padStart(2, '0')}回`);
      console.log(`[${keys[i]}] ${classLengthArray[i].toString()}`);
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
    console.log('');

    const targetSection: TargetSection = {
      index: index,
      id: `#section-${index}`,
    };
    if (targetSection.index > 0) {
      const parent = await Browser.page?.$(targetSection.id);
      const element = await parent?.$('.section-title');
      const href = await element!.$('a');
      if (!href) {
        console.log(chalk.yellow('This section is not selectable'));
        process.exit(0);
      }
      await Promise.all([Browser.page?.waitForNavigation(), href.click()]);
    }
  }
}
