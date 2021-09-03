import clui from 'clui';

export default class Spinner {
  private static _Clui = clui.Spinner;
  private static _spinner: clui.Spinner | undefined;
  static start(message: string) {
    this._spinner = new this._Clui(message, [
      '⣾',
      '⣽',
      '⣻',
      '⢿',
      '⡿',
      '⣟',
      '⣯',
      '⣷',
    ]);
    this._spinner.start();
  }
  static stop() {
    this._spinner?.stop();
  }
}
