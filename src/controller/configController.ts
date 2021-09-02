import { Config } from '../index';
import { IFunc } from 'iFunc';

export default class ConfigController implements IFunc {
  private _config: Config;
  constructor() {
    this._config = new Config();
  }
  async excute() {
    await this._config.excute();
  }
}
