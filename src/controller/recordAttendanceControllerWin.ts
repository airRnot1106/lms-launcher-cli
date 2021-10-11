import {
  Browser,
  Login,
  ClassSearcherWin,
  ClassSelectorWin,
  SectionSelectorWin,
  AttendanceRecorder,
} from '../index';
import { IFunc } from 'iFunc';

export default class RecordAttendanceControllerWin implements IFunc {
  private _login: Login;
  private _classSearcherWin: ClassSearcherWin;
  private _classSelectorWin: ClassSelectorWin;
  private _sectionSelectorWin: SectionSelectorWin;
  private _attendanceRecorder: AttendanceRecorder;
  constructor() {
    this._login = new Login();
    this._classSearcherWin = new ClassSearcherWin();
    this._classSelectorWin = new ClassSelectorWin();
    this._sectionSelectorWin = new SectionSelectorWin();
    this._attendanceRecorder = new AttendanceRecorder();
  }
  async execute() {
    await Browser.initialize(true);
    await this._login.execute();
    const classNames = await this._classSearcherWin.execute();
    await this._classSelectorWin.execute(classNames);
    await this._sectionSelectorWin.execute();
    await this._attendanceRecorder.execute();
  }
}
