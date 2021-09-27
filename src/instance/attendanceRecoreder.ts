import chalk from 'chalk';
import { Browser } from '../index';
import { IFunc } from 'iFunc';

export default class AttendanceRecorder implements IFunc {
  async excute() {
    await this.recoredAttendance();
  }
  private async recoredAttendance() {
    const parent = await Browser.page?.$('#region-main');
    const attendanceElement = await parent!.$('li.attendance');
    if (!attendanceElement) {
      console.log(chalk.yellow('No attendance taken for this class'));
      console.log(chalk.underline('Stop.'));
      process.exit(0);
    }
    const link = await attendanceElement.$('.aalink');
    await Promise.all([Browser.page?.waitForNavigation(), link?.click()]);
    const url = Browser.page?.url();
    await Browser.page?.goto(`${url}&view=5`);
    const statusCol = await Browser.page?.$('td.statuscol');
    const sendButton = await statusCol?.$x(
      './/a[contains(text(), "出欠を送信する")]'
    );
    if (!sendButton![0]) {
      console.log(
        chalk.yellow(
          'You have already attended or your attendance period has expired'
        )
      );
      process.exit(0);
    }
    await Promise.all([
      Browser.page?.waitForNavigation(),
      sendButton![0].click(),
    ]);
    const radio = await Browser.page?.$('.form-check-input');
    await radio?.click();
    const storeButton = await Browser.page?.$('#id_submitbutton');
    await Promise.all([
      Browser.page?.waitForNavigation(),
      storeButton?.click(),
    ]);
    console.log(chalk.greenBright('> Attendance has been sent'));
  }
}
