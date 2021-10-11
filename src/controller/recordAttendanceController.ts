import {
  Browser,
  Login,
  ClassSearcher,
  ClassSelector,
  SectionSelector,
  AttendanceRecorder,
} from '../index';
import { IFunc } from 'iFunc';

export default class RecordAttendanceController implements IFunc {
  private _login: Login;
  private _classSearcher: ClassSearcher;
  private _classSelector: ClassSelector;
  private _sectionSelector: SectionSelector;
  private _attendanceRecorder: AttendanceRecorder;
  constructor() {
    this._login = new Login();
    this._classSearcher = new ClassSearcher();
    this._classSelector = new ClassSelector();
    this._sectionSelector = new SectionSelector();
    this._attendanceRecorder = new AttendanceRecorder();
  }
  async execute() {
    await Browser.initialize(true);
    await this._login.execute();
    const classNames = await this._classSearcher.execute();
    await this._classSelector.execute(classNames);
    await this._sectionSelector.execute();
    await this._attendanceRecorder.execute();
  }
}
