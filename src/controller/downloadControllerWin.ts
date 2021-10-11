import chalk from 'chalk';
import {
  Browser,
  Login,
  ClassSearcherWin,
  ClassSelectorWin,
  SectionSelectorWin,
  ResourceSelectorWin,
  Downloader,
} from '../index';
import { IFunc } from '../iFunc';

export default class DownloadControllerWin implements IFunc {
  private _login: Login;
  private _searchingClassWin: ClassSearcherWin;
  private _selectingClassWin: ClassSelectorWin;
  private _selectingSectionWin: SectionSelectorWin;
  private _selectingResourceWin: ResourceSelectorWin;
  private _downloader: Downloader;
  constructor() {
    this._login = new Login();
    this._searchingClassWin = new ClassSearcherWin();
    this._selectingClassWin = new ClassSelectorWin();
    this._selectingSectionWin = new SectionSelectorWin();
    this._selectingResourceWin = new ResourceSelectorWin();
    this._downloader = new Downloader();
  }
  async execute() {
    await Browser.initialize(true);
    await this._login.execute();
    const classNames = await this._searchingClassWin.execute();
    await this._selectingClassWin.execute(classNames);
    await this._selectingSectionWin.execute();
    const downloadQueue = await this._selectingResourceWin.execute();
    for (let resource of downloadQueue) {
      await this._downloader.execute(resource);
    }
    console.log(
      chalk.greenBright.bold.bgGray('\n> All downloads are complete\n')
    );
  }
}
