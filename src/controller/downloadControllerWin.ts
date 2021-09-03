import chalk from 'chalk';
import {
  Browser,
  Login,
  ClassSearcherWin,
  ClassSelecterWin,
  SectionSelecterWin,
  ResourceSelecterWin,
  Downloader,
} from '../index';
import { IFunc } from '../iFunc';

export default class DownloadControllerWin implements IFunc {
  private _login: Login;
  private _searchingClassWin: ClassSearcherWin;
  private _selectingClassWin: ClassSelecterWin;
  private _selectingSectionWin: SectionSelecterWin;
  private _selectingResourceWin: ResourceSelecterWin;
  private _downloader: Downloader;
  constructor() {
    this._login = new Login();
    this._searchingClassWin = new ClassSearcherWin();
    this._selectingClassWin = new ClassSelecterWin();
    this._selectingSectionWin = new SectionSelecterWin();
    this._selectingResourceWin = new ResourceSelecterWin();
    this._downloader = new Downloader();
  }
  async excute() {
    await Browser.initialize(true);
    await this._login.excute();
    const classNames = await this._searchingClassWin.excute();
    await this._selectingClassWin.excute(classNames);
    await this._selectingSectionWin.excute();
    const downloadQueue = await this._selectingResourceWin.excute();
    for (let resource of downloadQueue) {
      await this._downloader.excute(resource);
    }
    console.log(
      chalk.greenBright.bold.bgGray('\n> All downloads are complete\n')
    );
  }
}
