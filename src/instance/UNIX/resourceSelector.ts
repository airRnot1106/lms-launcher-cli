import puppeteer from 'puppeteer-core';
import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser } from '../../index';
import { IFunc } from 'iFunc';

type ValidType = 'resource' | 'folder';

export type Resource = {
  element: puppeteer.ElementHandle<Element>;
  name: string;
  type: ValidType;
};

export default class resourceSelector implements IFunc {
  async execute() {
    return await this.selectResource();
  }
  private async selectResource() {
    const parent = await Browser.page?.$('#region-main');
    const singleSection = await parent?.$('div.single-section');
    const resources = await singleSection!.$$('li.resource, li.folder');
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
    for (let resource of resourceArray) {
      resourceNames.push(resource.name);
    }

    const downloadQueue: Resource[] = [];
    while (1) {
      const index = readlineSync.keyInSelect(
        resourceNames,
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
}
