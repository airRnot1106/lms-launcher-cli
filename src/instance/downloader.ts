import fs from 'fs';
import chalk from 'chalk';
import { Browser, Spinner } from '../index';
import { IFunc } from 'iFunc';
import { Resource } from './UNIX/resourceSelecter';

export default class Downloader implements IFunc {
  async excute(resource: Resource) {
    await this.download(resource);
  }
  private async download(resource: Resource) {
    const dir_home =
      process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
    const dir_desktop = require('path').join(dir_home, 'Downloads');
    const downloadPath = dir_desktop;
    const client = await Browser.page?.target().createCDPSession();
    client?.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadPath,
    });

    const link = await resource.element.$('.aalink');
    await link?.click();
    await this.waitDownloadComplete(downloadPath);
    console.log(chalk.greenBright(`> ${resource.name} download has completed`));
  }

  private async waitDownloadComplete(downloadPath: string) {
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
            Spinner.stop();
            resolve();
          } else {
            wait(path);
          }
        }, 1000);
      };
      Spinner.start('Now downloading... ');
      wait(downloadPath);
    });
  }
}
