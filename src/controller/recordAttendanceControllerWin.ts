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
  private _classSelecterWin: ClassSelectorWin;
  private _sectionSelecterWin: SectionSelectorWin;
  private _attendanceRecorder: AttendanceRecorder;
  constructor() {
    this._login = new Login();
    this._classSearcherWin = new ClassSearcherWin();
    this._classSelecterWin = new ClassSelectorWin();
    this._sectionSelecterWin = new SectionSelectorWin();
    this._attendanceRecorder = new AttendanceRecorder();
  }
  async execute() {
    await Browser.initialize(true);
    await this._login.execute();
    const classNames = await this._classSearcherWin.execute();
    await this._classSelecterWin.execute(classNames);
    await this._sectionSelecterWin.execute();
    await this._attendanceRecorder.execute();
  }
}
