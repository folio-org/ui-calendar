import { CalendarDTO } from '../../types/types';

interface MonthToLastDayOfMonth {
  [key: string]: string;
}

const currentDate: Date = new Date();
const currentYearInt: number = currentDate.getUTCFullYear();
const currentYear: string = currentYearInt.toString();
const currentMonth: string = ('0' + (currentDate.getUTCMonth() + 1).toString()).slice(-2);

let febNumberOfDays: string;
if ((currentYearInt % 4) === 0) {
  if ((currentYearInt % 100) === 0) {
    febNumberOfDays = (currentYearInt % 400) === 0 ? '29' : '28';
  } else {
    febNumberOfDays = '29';
  }
} else {
  febNumberOfDays = '28';
}


const monthToLastDay: MonthToLastDayOfMonth = {
  '01': '31',
  '02': febNumberOfDays,
  '03': '31',
  '04': '30',
  '05': '31',
  '06': '30',
  '07': '31',
  '08': '31',
  '09': '30',
  '10': '31',
  '11': '30',
  '12': '31',
};


const lastDayOfMonth: string = monthToLastDay[currentMonth];


interface CypressTestCalendarInfo {
  calendar: CalendarDTO,
  expectedUIValues: {
    monthlyCalendarView: {
      days: {
        monday: string,
        tuesday: string,
        wednesday: string,
        thursday: string,
        friday: string,
        saturday: string,
        sunday: string
      },
      exceptions: {
        [date: string]: string
      }
    }
  }
}

export const cypressTestCalendarInfo: CypressTestCalendarInfo = {
  calendar: {
    id: 'a8531527-aa3b-447a-8c76-88f905ade409',
    name: 'Cypress-Test-Calendar',
    assignments: [],
    startDate: `${currentYear}-${currentMonth}-01`,
    endDate: `${currentYear}-${currentMonth}-${lastDayOfMonth}`,
    normalHours: [
      {
        startDay: 'SATURDAY',
        startTime: '09:00',
        endDay: 'SATURDAY',
        endTime: '20:00'
      },
      {
        startDay: 'MONDAY',
        startTime: '09:00',
        endDay: 'TUESDAY',
        endTime: '02:00'
      },
      {
        startDay: 'TUESDAY',
        startTime: '09:00',
        endDay: 'WEDNESDAY',
        endTime: '00:00'
      },
      {
        startDay: 'WEDNESDAY',
        startTime: '09:00',
        endDay: 'WEDNESDAY',
        endTime: '23:00'
      },
      {
        startDay: 'THURSDAY',
        startTime: '09:00',
        endDay: 'THURSDAY',
        endTime: '23:00'
      },
      {
        startDay: 'FRIDAY',
        startTime: '09:00',
        endDay: 'FRIDAY',
        endTime: '19:00'
      },
    ],
    exceptions: [
      {
        name: 'Sample Holiday',
        startDate: `${currentYear}-${currentMonth}-01`,
        endDate: `${currentYear}-${currentMonth}-02`,
        openings: []
      },
      {
        name: 'Special Event',
        startDate: `${currentYear}-${currentMonth}-03`,
        endDate: `${currentYear}-${currentMonth}-05`,
        openings: [
          {
            startDate: `${currentYear}-${currentMonth}-03`,
            startTime: '06:00',
            endDate: `${currentYear}-${currentMonth}-03`,
            endTime: '23:59'
          },
          {
            startDate: `${currentYear}-${currentMonth}-04`,
            startTime: '06:00',
            endDate: `${currentYear}-${currentMonth}-04`,
            endTime: '21:59'
          },
          {
            startDate: `${currentYear}-${currentMonth}-05`,
            startTime: '06:00',
            endDate: `${currentYear}-${currentMonth}-05`,
            endTime: '22:59'
          }
        ]
      }
    ]
  },

  expectedUIValues: {
    monthlyCalendarView: {
      days: {
        monday: '9:00 AM – Midnight',
        tuesday: 'Midnight – 2:00 AM9:00 AM – Midnight',
        wednesday: 'Midnight – Midnight9:00 AM – 11:00 PM',
        thursday: '9:00 AM – 11:00 PM',
        friday: '9:00 AM – 7:00 PM',
        saturday: '9:00 AM – 8:00 PM',
        sunday: 'Closed'
      },
      exceptions: {
        [`${currentYear}-${currentMonth}-01`]: 'Closed',
        [`${currentYear}-${currentMonth}-02`]: 'Closed',
        [`${currentYear}-${currentMonth}-03`]: '6:00 AM – Midnight',
        [`${currentYear}-${currentMonth}-04`]: '6:00 AM – 9:59 PM',
        [`${currentYear}-${currentMonth}-05`]: '6:00 AM – 10:59 PM'
      },
    }

  }
};
