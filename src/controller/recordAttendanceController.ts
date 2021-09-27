import {
  Browser,
  Login,
  ClassSearcher,
  ClassSelecter,
  SectionSelecter,
  AttendanceRecorder,
} from '../index';
import { IFunc } from 'iFunc';

export default class RecordAttendanceController implements IFunc {
  private _login: Login;
  private _classSearcher: ClassSearcher;
  private _classSelecter: ClassSelecter;
  private _sectionSelecter: SectionSelecter;
  private _attendanceRecorder: AttendanceRecorder;
  constructor() {
    this._login = new Login();
    this._classSearcher = new ClassSearcher();
    this._classSelecter = new ClassSelecter();
    this._sectionSelecter = new SectionSelecter();
    this._attendanceRecorder = new AttendanceRecorder();
  }
  async excute() {
    await Browser.initialize(true);
    await this._login.excute();
    const classNames = await this._classSearcher.excute();
    await this._classSelecter.excute(classNames);
    await this._sectionSelecter.excute();
    await this._attendanceRecorder.excute();
  }
}
