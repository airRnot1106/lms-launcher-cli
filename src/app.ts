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
  RecordAttendanceControllerWin,
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
    | RecordAttendanceControllerWin
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
        'Configure user data. The option remove will destroy the saved configuration',
        (yargs) => {
          yargs.positional('remove', {
            type: 'string',
            default: '',
            describe: 'The option remove will destroy the saved configuration.',
          });
        }
      )
      .command('l', 'Login to LMS')
      .command('d', 'Download class resources')
      .command('a', 'Record attendance')
      .demandCommand(1)
      .help().argv;
    this.argv = argv;
    this.func = this.switchFunc(<string>this.argv._[0]);
  }
  private switchFunc(command: string) {
    switch (command) {
      case 'c':
      case 'C':
        if (this.argv?.remove === 'remove') {
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
      case 'tW':
        this.test('Win');
        break;
      case 'tU':
        this.test('UNIX');
        break;
      case 'a':
      case 'A':
        if (this.isWin) {
          return new RecordAttendanceControllerWin();
        }
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
  test(platform: 'Win' | 'UNIX') {
    switch (platform) {
      case 'Win':
        if (this.isWin) {
          console.log(chalk.greenBright('> Passed the Windows test'));
          process.exit(0);
        }
        console.log(chalk.red.bold('> Failed the Windows test'));
        process.exit(1);
      case 'UNIX':
        if (!this.isWin) {
          console.log(chalk.greenBright('> Passed the UNIX test'));
          process.exit(0);
        }
        console.log(chalk.red.bold('> Failed the UNIX test'));
        process.exit(1);
      default:
        break;
    }
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
