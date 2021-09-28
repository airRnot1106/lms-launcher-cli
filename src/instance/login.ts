import chalk from 'chalk';
import { Browser, Caution, PropertiesReader, Spinner } from '../index';
import { usernameAddress, passwordAddress } from '../static/propatiesReader';
import { IFunc } from '../iFunc';

export default class Login implements IFunc {
  constructor() {
    PropertiesReader.initialize(false);
  }
  async excute() {
    await this.login();
  }
  private async login() {
    const username = PropertiesReader.read(usernameAddress);
    const password = PropertiesReader.readCipher(passwordAddress);

    Spinner.start('Now logging in... ');

    await Browser.page?.setViewport({ width: 1280, height: 800 });
    try {
      await Browser.page?.goto(
        'https://tlms.tsc.u-tokai.ac.jp/login/index.php'
      );
    } catch (error) {
      Caution.toString(new Error('No Internet connection'), 'Network Error');
    }

    await Browser.page?.type('#username', username);
    await Browser.page?.type('#password', password);
    await Promise.all([
      Browser.page?.waitForNavigation(),
      Browser.page?.click('#loginbtn'),
    ]);
    if (await Browser.page?.$('.alert-danger')) {
      Caution.toString(
        new Error('Not a valid account name or password'),
        'Login Error'
      );
    }

    await Browser.page?.goto('https://tlms.tsc.u-tokai.ac.jp/my/');
    await Browser.page?.waitForSelector('div.card-deck');
    Spinner.stop();
    console.log(chalk.greenBright('> Login succeeded'));
  }
}
