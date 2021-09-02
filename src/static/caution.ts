import chalk from 'chalk';

export default class Caution {
  private static error: { name: string; message: string } | undefined =
    undefined;
  private static initialize(error: Error, cName?: string) {
    const name = cName || error.name;
    const message = error.message;
    this.error = {
      name: name,
      message: message,
    };
  }
  static toString(error: Error, cName?: string) {
    this.initialize(error, cName);
    console.error(
      chalk.red.bold(`${this.error?.name}: ${this.error?.message}`)
    );
    process.exit(1);
  }
}
