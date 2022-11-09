/// <reference types="cypress" />
import { Calendar, ErrorResponse } from '../../types/types';
import { ServicePointDTO } from '../../data/types';


declare namespace Cypress {
    interface Chainable {
        login(username: string, password: string): void;
        loginAsAdmin(): void;
        openCalendarSettings(isLoggedIn?: boolean): void;
        createCalendar(reqBody: Calendar, callback: (res: Response<Calendar>) => void): void;
        deleteCalendar(calendarID: string, callback?: (res: Response<ErrorResponse>) => void): void;
        createServicePoint(reqBody: Calendar, callback: (res: Response<ServicePointDTO>) => void): void;
        deleteServicePoint(calendarID: string, callback?: (res: Response<ErrorResponse>) => void): void;
    }
}
