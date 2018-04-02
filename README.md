# Ionic Calendar (English)

A straight forward calendar module that has the optional capability to expand to *clickable days*, trackable *events* and *holidays*, with unobtrusive boiler-plating.

## Ionic Support

This module was tested to Ionic v3.19.0.

### Installing

Go ahead and install via NPM

```
npm install ionic2-calendar-en --save
```

Within your **app.module.ts** file, make sure to add the import.

```javascript
import { CalendarModule } from 'ionic2-calendar-en';
@NgModule({
  ...
imports: [
  ...
  CalendarModule,
  ...
]
  ...
})
```

## Usage / Getting started

Basic usage is as follows:

Swipe to view next and previous months.

```javascript
<ion-calendar #calendar></ion-calendar>
```

To make days clickable, and emit back information about the day selected, include the onDaySelect binding.

```javascript
<ion-calendar #calendar (onDaySelect)="onDaySelect($event)"></ion-calendar>
```

You can add a button to jump to today, for ease of navigation:

```javascript
<button ion-button (click)="calendar.today()">Jump to Today</button>
```

You can add a button to jump to next and previous day, for ease of navigation:

```javascript
<button ion-button (click)="calendar.toNextDay()">Jump to Next Day</button>
<button ion-button (click)="calendar.toPreviousDay()">Jump to Previous Day</button>
```

You can get selected date:
```javascript
calendar.getSelectedDate();

return
{
  year: number,
  month: number,
  date: number
}
```

You can get selected date as string format:
```javascript
calendar.getSelectedDateString();

Format eg. February 20, 2018
```

You can get holiday reason of selected day:
```javascript
calendar.getHolidayReason();

return String;
```
##### If selected day isn't holiday then returns empty string.

### Events

Adding events to the calendar, as seen in the screenshot atop, those tiny notification blips can appear on a given day, if your backend API responds with the right date makeup for the given month. I suggest you write something that provides data for the former and the latter month, for the sake of edge days on a given month.

Accepted format of data:

```javascript
this.currentEvents = [
  {
    year: 2018,
    month: 11, //Month as current -1
    date: 25
  },
  {
    year: 2018,
    month: 11, //Month as current -1
    date: 26
  }
];
```

The consequent invocation of these events would be done like so:

```javascript
<ion-calendar #calendar [events]="currentEvents" (onDaySelect)="onDaySelect($event)" (onMonthSelect)="onMonthSelect($event)"></ion-calendar>
```

### Holidays

Adding holidays to the calendar, red colored date can appear on a given day, if your backend API responds with the right date makeup for the given month. I suggest you write something that provides data for the former and the latter month, for the sake of edge days on a given month.

Accepted format of data:

```javascript
this.holidaysList = [
  {
    year: 2018,
    month: 2, //Month as current -1
    date: 30,
    reason: 'Good Friday'
  },
  {
    year: 2018,
    month: 2, //Month as current -1
    date: 2,
    reason: 'Holi'
  }
];
```

The consequent invocation of these events would be done like so:

```javascript
<ion-calendar #calendar [holidays]="holidaysList" (onDaySelect)="onDaySelect($event)" (onMonthSelect)="onMonthSelect($event)"></ion-calendar>
```

## Authors

* **Laker Liu** - *Initial work* - [Ionic3-Calendar](https://github.com/laker007/ionic3-calendar)

**It's not what you start in life, it's what you finish.**
