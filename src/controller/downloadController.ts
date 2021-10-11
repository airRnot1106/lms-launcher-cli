import chalk from 'chalk';
import {
  Browser,
  Login,
  ClassSearcher,
  ClassSelector,
  SectionSelector,
  ResourceSelector,
  Downloader,
} from '../index';
import { IFunc } from 'iFunc';

export default class DownloadController implements IFunc {
  private _login: Login;
  private _searchingClass: ClassSearcher;
  private _selectingClass: ClassSelector;
  private _selectingSection: SectionSelector;
  private _selectingResource: ResourceSelector;
  private _downloader: Downloader;
  constructor() {
    this._login = new Login();
    this._searchingClass = new ClassSearcher();
    this._selectingClass = new ClassSelector();
    this._selectingSection = new SectionSelector();
    this._selectingResource = new ResourceSelector();
    this._downloader = new Downloader();
  }
  async execute() {
    await Browser.initialize(true);
    await this._login.execute();
    const classNames = await this._searchingClass.execute();
    await this._selectingClass.execute(classNames);
    await this._selectingSection.execute();
    const downloadQueue = await this._selectingResource.execute();
    for (let resource of downloadQueue) {
      await this._downloader.execute(resource);
    }
    console.log(
      chalk.greenBright.bold.bgGray('\n> All downloads are complete\n')
    );
  }
}
