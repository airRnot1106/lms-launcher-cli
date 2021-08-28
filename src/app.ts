import puppeteer from 'puppeteer-core';
import yargs from 'yargs';
import chalk from 'chalk';
import { Caution, Config, Login } from './index';

type Argv = {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
};

export default class App {
  caution: Caution;
  private argv: Argv | undefined;
  private func: Config | Login | undefined;
  constructor() {
    this.caution = new Caution();
    this.argv = undefined;
    this.func = undefined;
  }
  async initialize() {
    const argv = await yargs
      .command('c', 'configure user data')
      .command('r', 'recored an attendance')
      .demandCommand(1)
      .help().argv;
    this.argv = argv;
    this.func = this.switchFunc(<string>this.argv._[0]);
  }
  private switchFunc(command: string) {
    switch (command) {
      case 'c':
      case 'C':
        return new Config();
      case 'r':
      case 'R':
        return new Login();
      default:
        this.caution.toString(
          new Error(
            "An invalid command was specified. If you need help, use the '--help' option"
          )
        );
    }
  }
  private checkExistsFunc() {
    if (!this.func) {
      this.caution.toString(
        new Error('An invalid function was specified'),
        'Fatal Error'
      );
    }
  }
  excute() {
    this.checkExistsFunc();
    this.func?.excute();
  }
}

(async () => {
  const app = new App();
  await app.initialize();
  console.log(chalk.underline('Start AAR...'));
  app.excute();
})();
