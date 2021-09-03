import readlineSync from 'readline-sync';
import chalk from 'chalk';
import { Browser, Login } from '../index';
import { IFunc } from 'iFunc';

export default class OpenController implements IFunc {
  private _login: Login;
  constructor() {
    this._login = new Login();
  }
  async excute() {
    await Browser.initialize(false);
    console.log('> Login <');
    await this._login.excute();
    while (1) {
      const isClose = readlineSync.keyInYNStrict(
        chalk.bold('Do you want to close your browser?')
      );
      if (isClose) {
        break;
      }
    }
  }
}
