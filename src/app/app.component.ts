import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-timer',
  templateUrl: './app.component.html',
  styleUrls : ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private submitForm: boolean;
  private formError: boolean;
  private timerSet: boolean;
  private countdownHours: number;
  private countdownMinutes: number;
  private countdownSeconds: number;
  private countdownTime: any = {};
  private timerObservable: any;
  private countdownEnd: boolean;
  constructor() {}

  ngOnInit(): void {
    this.countdownEnd = false;
    this.submitForm = false;
  }

  setTimer(form: NgForm): void {
    this.submitForm = true;
    this.formError = false;
    if (!form.valid
          ||
        !form.controls.hours.touched
          ||
        !form.controls.minutes.touched
          ||
        !form.controls.seconds.touched) {
      this.formError = true;
      return;
    }
    if (form.value.hours < 0
          ||
        form.value.minutes < 0 || form.value.minutes > 59
          ||
        form.value.seconds < 0 || form.value.seconds > 59) {
      this.formError = true;
      return;
    }
    this._setCountdownTimer(form.value.hours, form.value.minutes, form.value.seconds);
    this.timerSet = true;
  }

  private _setCountdownTimer(hrs: number = 0, mins: number = 0, secs: number = 0): void {
    const currentTime: any = new Date();
    const currentInputTime: any = new Date();
    currentInputTime.setHours(currentInputTime.getHours() + hrs);
    currentInputTime.setMinutes(currentInputTime.getMinutes() + mins);
    currentInputTime.setSeconds(currentInputTime.getSeconds() + secs);
    this.countdownTime['date'] = (new Date(currentInputTime)).toDateString();
    this.countdownTime['time'] = (new Date(currentInputTime)).toLocaleTimeString();
    let timeDiff = Math.abs(currentInputTime - currentTime);
    timeDiff = timeDiff / 1000;
    const that = this;
    this.timerObservable = Observable.timer(1000, 1000).take(timeDiff)
    .map( () => timeDiff -= 1)
    .subscribe(res => {
      if (res <= 0) {
        that._notifyUser();
      } else {
        that._showCountdown(res);
      }
    });
  }

  private _notifyUser(): void {
    this.countdownHours = 0;
    this.countdownMinutes = 0;
    this.countdownSeconds = 0;
    this.countdownEnd = true;
  }
  private _showCountdown(time: number) {
    this.countdownHours = this._calHours(time);
    this.countdownMinutes = this._calMinutes(time);
    this.countdownSeconds = this._calSeconds(time);
  }
  private _calSeconds(ticks: number) {
    return this._pad(Math.floor(ticks % 60));
  }
  private _calMinutes(ticks: number) {
    return this._pad((Math.floor(ticks / 60)) % 60);
  }
  private _calHours(ticks: number) {
    return this._pad(Math.floor(((ticks / 60) / 60) % 60));
  }
  private _calDays(ticks: number) {
    return this._pad(Math.floor(((ticks / 60) / 60) / 24));
  }
  private _pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }

  startNewTimer(): void {
    this.resetTimer();
    this.countdownEnd = false;
  }
  resetTimer(): void {
    this.timerSet = false;
    this.submitForm = false;
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
  }

  clearTimer(form: NgForm): void {
    form.resetForm();
  }
}
