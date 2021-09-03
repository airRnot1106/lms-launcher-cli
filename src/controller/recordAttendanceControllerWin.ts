import {
  Browser,
  Login,
  ClassSearcherWin,
  ClassSelecterWin,
  SectionSelecterWin,
  AttendanceRecorder,
} from '../index';
import { IFunc } from 'iFunc';

export default class RecordAttendanceControllerWin implements IFunc {
  private _login: Login;
  private _classSearcherWin: ClassSearcherWin;
  private _classSelecterWin: ClassSelecterWin;
  private _sectionSelecterWin: SectionSelecterWin;
  private _attendanceRecorderWin: AttendanceRecorder;
  constructor() {
    this._login = new Login();
    this._classSearcherWin = new ClassSearcherWin();
    this._classSelecterWin = new ClassSelecterWin();
    this._sectionSelecterWin = new SectionSelecterWin();
    this._attendanceRecorderWin = new AttendanceRecorder();
  }
  async excute() {
    await Browser.initialize(true);
    await this._login.excute();
    const classNames = await this._classSearcherWin.excute();
    await this._classSelecterWin.excute(classNames);
    await this._sectionSelecterWin.excute();
    await this._attendanceRecorderWin.excute();
  }
}
