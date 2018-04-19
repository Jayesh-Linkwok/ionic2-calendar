import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
    selector: 'ion-calendar',
    template: `
    <ion-grid (swipe)="swipe($event)">
        <ion-row justify-content-center>
            <ion-col col-auto (click)="back()">
                <ion-icon ios="ios-arrow-back" md="md-arrow-back"></ion-icon>
            </ion-col>
            <ion-col col-auto>
                <div>{{displayMonth + 1 | monthName}} - {{displayYear}}</div>
            </ion-col>
            <ion-col col-auto (click)="forward()">
                <ion-icon ios="ios-arrow-forward" md="md-arrow-forward"></ion-icon>
            </ion-col>
        </ion-row>

        <ion-row>
            <ion-col class="center calendar-header-col" *ngFor="let head of weekHead">{{head}}</ion-col>
        </ion-row>

        <ion-row class="calendar-row" *ngFor="let week of weekArray;let i = index">
            <ion-col class="center calendar-col" (click)="daySelect(day,i,j)"
            *ngFor="let day of week;let j = index"
            [ngStyle]="day.attendance"
            [ngClass]="[day.isThisMonth?'this-month':'not-this-month',day.isToday?'today':'',day.isSelect?'select':'',day.isHoliday?'holiday':'']">
                {{day.date}}
                <span class="eventBlip" *ngIf="day.hasEvent"></span>
            </ion-col>
        </ion-row>

    </ion-grid>
`
})

export class Calendar {
    //Jonah is controlling this asset

    @Output() onDaySelect = new EventEmitter<dateObj>();
    @Output() onMonthSelect = new EventEmitter<any>();
    @Input() events: Array<singularDate> = [];
    @Input() holidays: Array<holidayDate> = [];
    @Input() attendance: Array<attendance> = [];

    currentYear: number = moment().year();
    currentMonth: number = moment().month();
    currentDate: number = moment().date();
    currentDay: number = moment().day();

    displayYear: number = moment().year();
    displayMonth: number = moment().month();
    displayDate: number = moment().date();

    dateArray: Array<dateObj> = []; // Array for all the days of the month
    weekArray = []; // Array for each row of the calendar
    // lastSelect: number = 0; // Record the last clicked location
    lastSelectIndex:dateObj;

    weekHead: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    todayIndexObject: dateObj = {
        year: this.currentYear,
        month: this.currentMonth,
        date: this.currentDate,
        isThisMonth: true
    };

    constructor() {
      this.today();
      this.createMonth(this.displayYear, this.displayMonth);
    }

    ngOnChanges() {
      this.createMonth(this.displayYear, this.displayMonth);
    }

    ngAfterContentInit() {
        this.onMonthSelect.emit({
            'year': this.displayYear,
            'month': this.displayMonth
        });
        let todayIndex = _.findIndex(this.dateArray, this.todayIndexObject);
        this.onDaySelect.emit(this.dateArray[todayIndex]);
    }

    swipe(event) {
        if (event.direction === 2) {
            this.forward();
        }
        if (event.direction === 4) {
            this.back();
        }
    }

    // Jump to today
    today() {
        this.displayYear = this.currentYear;
        this.displayMonth = this.currentMonth;
        this.createMonth(this.currentYear, this.currentMonth);

        // Mark today as a selection
        let todayIndex = _.findIndex(this.dateArray, this.todayIndexObject)
        // this.lastSelect = todayIndex;
        this.unSelectDay();
        this.dateArray[todayIndex].isSelect = true;
        this.lastSelectIndex = this.dateArray[todayIndex];

        this.onDaySelect.emit(this.dateArray[todayIndex]);
    }

    toNextDay() {
        // Mark next day as a selection
        let nextday = moment({ year: this.lastSelectIndex.year, month: this.lastSelectIndex.month, date: this.lastSelectIndex.date }).add(1, 'days');
        this.displayYear = nextday.year();
        this.displayMonth = nextday.month();
        this.displayDate = nextday.date();
        this.createMonth(this.displayYear, this.displayMonth);        

        let nextdayIndex = _.findIndex(this.dateArray, {
            year: this.displayYear,
            month: this.displayMonth,
            date: this.displayDate,
            isThisMonth: true
        });

        // this.lastSelect = nextdayIndex;
        this.unSelectDay();
        this.dateArray[nextdayIndex].isSelect = true;
        this.dateArray[nextdayIndex].isToday = false;
        this.lastSelectIndex = this.dateArray[nextdayIndex];
        
        console.log("To Next Day", this.displayDate+", "+this.displayMonth+", "+this.displayYear);
        this.onDaySelect.emit(this.dateArray[nextdayIndex]);
    }

    toPreviousDay() {
        // Mark previous day as a selection
        let previousday = moment({ year: this.lastSelectIndex.year, month: this.lastSelectIndex.month, date: this.lastSelectIndex.date }).subtract(1, 'days');
        this.displayYear = previousday.year();
        this.displayMonth = previousday.month();
        this.displayDate = previousday.date();
        this.createMonth(this.displayYear, this.displayMonth);
        let previousdayIndex = _.findIndex(this.dateArray, {
            year: this.displayYear,
            month: this.displayMonth,
            date: this.displayDate,
            isThisMonth: true
        });
        // this.lastSelect = previousdayIndex;
        this.unSelectDay();
        this.dateArray[previousdayIndex].isSelect = true;
        this.dateArray[previousdayIndex].isToday = false;
        this.lastSelectIndex = this.dateArray[previousdayIndex];

        console.log("To Previous Day", this.displayDate + ", " + this.displayMonth + ", " + this.displayYear);
        this.onDaySelect.emit(this.dateArray[previousdayIndex]);
    }

    isInEvents(year, month, date) {
      var i=0, len=this.events.length;
      for (; i<len; i++) {
        if (this.events[i].year == year && this.events[i].month == month && this.events[i].date == date) {
          return true;
        }
      }
      return false;
    }

    isInHoliday(year,month,date){        
        var i = 0, len = this.holidays.length;
        for (; i < len; i++) {
            if (this.holidays[i].year == year && this.holidays[i].month == month && this.holidays[i].date == date) {
                return true;
            }
        }
        return false;
    }
    
    isInAttendance(year, month, date) {
        var i = 0, len = this.attendance.length;
        for (; i < len; i++) {
            if (this.attendance[i].year == year && this.attendance[i].month == month && this.attendance[i].date == date) {
                return {
                    background: this.attendance[i].background,
                    color: this.attendance[i].color
                };
            }
        }
        return "";
    }

    getAttendance(year, month, date) {
        var i = 0, len = this.attendance.length;
        for (; i < len; i++) {
            if (this.attendance[i].year == year && this.attendance[i].month == month && this.attendance[i].date == date) {
                return this.attendance[i].data;
            }
        }
        return "";
    }

    createMonth(year: number, month: number) {
        this.dateArray = []; // Clear last month's data
        this.weekArray = []; // Clear week data

        let firstDay;
        // The day of the week on the first day of the current month of
        // selection determines how many days to take out last month. Sunday
        // does not show last month, Monday shows the previous month, Tuesday
        // shows the last two days

        let preMonthDays; // The number of days for the previous month
        let monthDays; // The number of days for the month
        let weekDays: Array<dateObj> = [];

        firstDay = moment({ year: year, month: month, date: 1 }).day();
        // The number of days last month
        if (month === 0) {
            preMonthDays = moment({ year: year - 1, month: 11 }).daysInMonth();
        } else {
            preMonthDays = moment({ year: year, month: month - 1 }).daysInMonth();
        }
        // The number of days this month
        monthDays = moment({ year: year, month: month }).daysInMonth();

        // PREVIOUS MONTH
        // Add the last few days of the previous month to the array
        if (firstDay !== 7) { // Sunday doesn't need to be shown for the previous month
            let lastMonthStart = preMonthDays - firstDay + 1; // From the last few months start
            for (let i = 0; i < firstDay; i++) {
                if (month === 0) {
                    this.dateArray.push({
                        year: year-1,
                        month: 11,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year-1, 11, lastMonthStart+i)) ? true : false,
                        isHoliday: this.isInHoliday(year-1, 11, lastMonthStart+i) ? true : false,
                        attendance: this.isInAttendance(year - 1, 11, lastMonthStart + i),
                        attendanceData: this.getAttendance(year - 1, 11, lastMonthStart + i),
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month - 1,
                        date: lastMonthStart + i,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month-1, lastMonthStart+i)) ? true : false,
                        isHoliday: this.isInHoliday(year, month-1, lastMonthStart+i) ? true : false,
                        attendance: this.isInAttendance(year, month - 1, lastMonthStart + i),
                        attendanceData: this.getAttendance(year, month - 1, lastMonthStart + i),
                    })
                }

            }
        }

        // Add the numeral for this month to the array
        for (let i = 0; i < monthDays; i++) {
            this.dateArray.push({
                year: year,
                month: month,
                date: i + 1,
                isThisMonth: true,
                isToday: false,
                isSelect: false,
                hasEvent: (this.isInEvents(year, month, i+1)) ? true : false,
                isHoliday: this.isInHoliday(year, month, i+1) ? true : false,
                attendance: this.isInAttendance(year, month, i + 1),
                attendanceData: this.getAttendance(year, month, i + 1),
            })
        }

        if (this.currentYear === year && this.currentMonth === month) {
            let todayIndex = _.findIndex(this.dateArray, {
                year: this.currentYear,
                month: this.currentMonth,
                date: this.currentDate,
                isThisMonth: true
            })
            this.dateArray[todayIndex].isToday = true;
        }

        if(this.lastSelectIndex){
            let lastSel = this.lastSelectIndex;
            lastSel.isSelect = false;
            let lastIndex = _.findIndex(this.dateArray, lastSel)
            console.log(this.lastSelectIndex);
            
            if(lastIndex !== -1){
                this.dateArray[lastIndex].isSelect = true;
            }
        }

        // Add the number of days next month to the array, with some months showing 6 weeks and some months showing 5 weeks
        if (this.dateArray.length % 7 !== 0) {
            let nextMonthAdd = 7 - this.dateArray.length % 7
            for (let i = 0; i < nextMonthAdd; i++) {
                if (month === 11) {
                    this.dateArray.push({
                        year: year+1,
                        month: 0,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year+1, 0, i+1)) ? true : false,
                        isHoliday: this.isInHoliday(year+1, 0, i+1) ? true : false,
                        attendance: this.isInAttendance(year + 1, 0, i + 1),
                        attendanceData: this.getAttendance(year + 1, 0, i + 1),
                    })
                } else {
                    this.dateArray.push({
                        year: year,
                        month: month + 1,
                        date: i + 1,
                        isThisMonth: false,
                        isToday: false,
                        isSelect: false,
                        hasEvent: (this.isInEvents(year, month+1, i+1)) ? true : false,
                        isHoliday: this.isInHoliday(year, month+1, i+1) ? true : false,
                        attendance: this.isInAttendance(year, month + 1, i + 1),
                        attendanceData: this.getAttendance(year, month + 1, i + 1),
                    })
                }

            }
        }

        // All date data is now added to the dateArray array

        // Insert the date data into the new array every seven days
        for (let i = 0; i < this.dateArray.length / 7; i++) {
            for (let j = 0; j < 7; j++) {
                weekDays.push(this.dateArray[i * 7 + j]);
            }
            this.weekArray.push(weekDays);
            weekDays = [];
        }
    }

    back() {
        // Decrementing the year if necessary
        if (this.displayMonth === 0) {
            this.displayYear--;
            this.displayMonth = 11;
        } else {
            this.displayMonth--;
        }
        this.onMonthSelect.emit({
          'year': this.displayYear,
          'month': this.displayMonth
        });
        this.createMonth(this.displayYear, this.displayMonth);
    }

    forward() {
        // Incrementing the year if necessary
        if (this.displayMonth === 11) {
            this.displayYear++;
            this.displayMonth = 0;
        } else {
            this.displayMonth++;
        }
        this.onMonthSelect.emit({
          'year': this.displayYear,
          'month': this.displayMonth
        });
        this.createMonth(this.displayYear, this.displayMonth);
    }

    // Select a day, click event
    daySelect(day, i, j) {
        // // First clear the last click status
        // this.dateArray[this.lastSelect].isSelect = false;
        // // Store this clicked status
        // this.lastSelect = i * 7 + j;
        // this.dateArray[i * 7 + j].isSelect = true;
        // this.lastSelectIndex = this.dateArray[i * 7 + j];
        this.unSelectDay();
        let selectedIndex = _.findIndex(this.dateArray,day);
        this.dateArray[selectedIndex].isSelect = true;

        this.lastSelectIndex = day;
        this.onDaySelect.emit(day);
    }

    unSelectDay(){
        if(this.lastSelectIndex){
            let lastSelectedIndex = _.findIndex(this.dateArray, this.lastSelectIndex);
            if (lastSelectedIndex !== -1) {
                this.dateArray[lastSelectedIndex].isSelect = false;
            }

            let lastSel = this.lastSelectIndex;
            lastSel.isSelect = true;

            lastSelectedIndex = _.findIndex(this.dateArray, this.lastSelectIndex);
            if (lastSelectedIndex !== -1) {
                this.dateArray[lastSelectedIndex].isSelect = false;
            }
        }
    }

    getSelectedDate(){
        return {
            year: this.lastSelectIndex.year,
            month: this.lastSelectIndex.month,
            date: this.lastSelectIndex.date
        };
    }

    getSelectedDateString(){
        let date = moment({ year: this.lastSelectIndex.year, month: this.lastSelectIndex.month, date: this.lastSelectIndex.date })
        // February 20, 2018
        return date.format('MMMM DD, YYYY');
    }

    getHolidayReason(){
        let year = this.lastSelectIndex.year;
        let month = this.lastSelectIndex.month;
        let date = this.lastSelectIndex.date;
        var i = 0, len = this.holidays.length;
        for (; i < len; i++) {
            if (this.holidays[i].year == year && this.holidays[i].month == month && this.holidays[i].date == date) {
                return this.holidays[i].reason;
            }
        }
        return '';
    }
}

interface singularDate {
  year: number,
  month: number,
  date: number
}

interface holidayDate {
    year: number,
    month: number,
    date: number,
    reason:string
}

interface attendance {
    year: number,
    month: number,
    date: number,
    background: string,
    color: string,
    data:any
}

// Each grid item of a calendar
interface dateObj {
    year: number,
    month: number,
    date: number, // What's the date?
    isThisMonth: boolean, // Is this the currently selected month?
    isToday?: boolean,
    isSelect?: boolean,
    isHoliday?: boolean,
    hasEvent?: boolean,
    attendance?:any,
    attendanceData?: any
}
