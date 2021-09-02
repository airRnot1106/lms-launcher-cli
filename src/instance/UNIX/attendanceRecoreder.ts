import chalk from 'chalk';
import { Browser } from '../../index';
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
  }
}
