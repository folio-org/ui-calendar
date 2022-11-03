/// <reference types="cypress" />
interface TestHour {
    calendarId: string;
    startDate: string;
    startTime: string;
    endDay: string;
    endTime: string;
}

interface TestException {
    calendarId: string;
    name: string;
    startDate: string;
    endDate: string;
    openings: {
        exceptionId: string,
        startDate: string;
        startTime: string;
        endDay: string;
        endTime: string;
    }[]
}

interface TestCalendarReqBody{
    name: string;
    startDate: string;
    endDate: string;
    assignments: string[];
    normalHours: TestHour[];
    exceptions: TestException[];
}


declare namespace Cypress {
    interface Chainable {
        login(username: string, password: string): void;
        loginAsAdmin(): void;
        openCalendarSettings(isLoggedIn?: boolean): void;
        createCalendar(reqBody: TestCalendarReqBody, callback: (res: Response<any>) => void): void;
        deleteCalendar(calendarID: string, callback?: (res: Response<any>) => void): void;
    }
}
