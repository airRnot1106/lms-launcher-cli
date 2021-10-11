import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser, Caution } from '../../index';
import { IFunc } from 'iFunc';

type TargetSection = {
  index: number;
  id: string;
};

export default class SectionSelector implements IFunc {
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
    }
    const index = readlineSync.keyInSelect(
      classLengthArray,
      chalk.bold('Which sections?'),
      { cancel: false }
    );
    console.log('');
    console.log(`${classLengthArray[index]}: `);

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
