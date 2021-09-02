import yargs from 'yargs';
import chalk from 'chalk';
import {
  Caution,
  OpenController,
  ConfigController,
  DestroyController,
  DownloadController,
  DownloadControllerWin,
  RecordAttendanceController,
} from './index';

type Argv = {
  [x: string]: unknown;
  _: (string | number)[];
  $0: string;
};

export default class App {
  private isWin: boolean;
  private argv: Argv | undefined;
  private func:
    | ConfigController
    | DestroyController
    | OpenController
    | DownloadController
    | DownloadControllerWin
    | RecordAttendanceController
    | undefined;
  constructor() {
    this.isWin = process.platform == 'win32';
    this.argv = undefined;
    this.func = undefined;
  }
  async initialize() {
    const argv = await yargs
      .command(
        'c [remove]',
        'Configure user data. The option --remove will destroy the saved configuration',
        (yargs) => {
          yargs.positional('remove', {
            type: 'boolean',
            default: false,
            describe:
              'The option --remove will destroy the saved configuration.',
          });
        }
      )
      .command('l', 'Login to LMS')
      .command('d', 'Download class resources')
      .demandCommand(1)
      .help().argv;
    this.argv = argv;
    this.func = this.switchFunc(<string>this.argv._[0]);
  }
  private switchFunc(command: string) {
    switch (command) {
      case 'c':
      case 'C':
        if (this.argv?.remove) {
          return new DestroyController();
        }
        return new ConfigController();
      case 'l':
      case 'L':
        return new OpenController();
      case 'd':
      case 'D':
        if (this.isWin) {
          return new DownloadControllerWin();
        } else {
          return new DownloadController();
        }
      case 'a':
      case 'A':
        return new RecordAttendanceController();
      default:
        Caution.toString(
          new Error(
            "An invalid command was specified. If you need help, use the '--help' option"
          )
        );
    }
  }
  private checkExistsFunc() {
    if (!this.func) {
      Caution.toString(
        new Error('An invalid function was specified'),
        'Fatal Error'
      );
    }
  }
  async excute() {
    this.checkExistsFunc();
    await this.func?.excute();
  }
}

export function cli() {
  (async () => {
    const app = new App();
    await app.initialize();
    console.log(chalk.underline('Launch...'));
    await app.excute();
    console.log(chalk.underline('Stop.'));
    process.exit(0);
  })();
}

cli();
