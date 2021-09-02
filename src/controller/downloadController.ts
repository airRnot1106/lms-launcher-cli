import chalk from 'chalk';
import {
  Browser,
  Login,
  ClassSearcher,
  ClassSelecter,
  SectionSelecter,
  ResourceSelecter,
  Downloader,
} from '../index';
import { IFunc } from 'iFunc';

export default class DownloadController implements IFunc {
  private _login: Login;
  private _searchingClass: ClassSearcher;
  private _selectingClass: ClassSelecter;
  private _selectingSection: SectionSelecter;
  private _selectingResource: ResourceSelecter;
  private _downloader: Downloader;
  constructor() {
    this._login = new Login();
    this._searchingClass = new ClassSearcher();
    this._selectingClass = new ClassSelecter();
    this._selectingSection = new SectionSelecter();
    this._selectingResource = new ResourceSelecter();
    this._downloader = new Downloader();
  }
  async excute() {
    await Browser.initialize(true);
    await this._login.excute();
    const classNames = await this._searchingClass.excute();
    await this._selectingClass.excute(classNames);
    await this._selectingSection.excute();
    const downloadQueue = await this._selectingResource.excute();
    for (let resource of downloadQueue) {
      await this._downloader.excute(resource);
    }
    console.log(
      chalk.greenBright.bold.bgGray('\n> All downloads are complete\n')
    );
  }
}