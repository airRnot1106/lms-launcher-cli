import { Destroy } from '../index';
import { IFunc } from '../iFunc';

export default class DestroyController implements IFunc {
  private _destroy: Destroy;
  constructor() {
    this._destroy = new Destroy();
  }
  async execute() {
    this._destroy.execute();
  }
}
