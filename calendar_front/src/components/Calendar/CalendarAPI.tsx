import type {CalendarListed, Event, EventJSON, CalendarCreate} from "../../interfaces/CalendarInterface"
    
const loadCalendar = async (userID: number, base: string): Promise<Set<CalendarListed>> => {
    try {
        const jsonObj = {user_id: userID};
        const response = await fetch(`${base}/calendar/getCalendars`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            const newListOfCalendars = new Set<CalendarListed>();
            for (const calendar of results.calendars) {
                let {user_id, id, created_at, updated_at, ...destructure} = calendar;
                const getEvents: Event[] = await getSpecificCalendar(calendar.id, base);
                let calendarItem: CalendarListed = {...destructure, calendar_id: calendar.id, events: getEvents};
                newListOfCalendars.add(calendarItem);
            };
            return newListOfCalendars;
        }
        else return new Set<CalendarListed>();
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return new Set<CalendarListed>();
    }    
}

function turnToEvent(calendarEvents: EventJSON): Event {
    const start_date = new Date(calendarEvents.start_time);
    const end_date = (calendarEvents.end_time === "") ? undefined : new Date(calendarEvents.end_time);
    const recur_start_date = (calendarEvents.recurrence_start === "") ? undefined : new Date(calendarEvents.recurrence_start);
    const recur_end_date = (calendarEvents.recurrence_end === "") ? undefined : new Date(calendarEvents.recurrence_end);
    const {created_at, updated_at, id, ...destructure} = calendarEvents;
    return {...destructure, event_id: id, start_time: start_date, end_time: end_date, recurrence_start: recur_start_date, recurrence_end: recur_end_date}
} 

const getSpecificCalendar = async (calendarID: number, base: string): Promise<Event[]> => {
    try {
        const jsonObj = {calendar_id: calendarID};
        const response = await fetch(`${base}/calendar/getCalendar`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(jsonObj)
        });
        const results = await response.json();
        if (response.ok && results.status) {
            const listOfEvents: Event[] = [];
            results.events.forEach((event: EventJSON) => {
                listOfEvents.push(turnToEvent(event));
            });
            return listOfEvents;
        }
        return [];
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return [];
    }  
} 

const addOrRemoveCalendar = (findID: number, add: boolean, listOfCalendars: Set<CalendarListed>, 
    activeCalendars: Set<CalendarListed>): Set<CalendarListed> => {
    for (const c of listOfCalendars) {
        if (c.calendar_id === findID) {
            const newActiveCalendars = new Set<CalendarListed>(activeCalendars);
            (add) ? newActiveCalendars.add(c) : newActiveCalendars.delete(c);
            return newActiveCalendars;
        }
    }
    return activeCalendars;
}

const makeNewCalendar = async (calendar_info: CalendarCreate, base: string, 
    listOfCalendars: Set<CalendarListed>): Promise<Set<CalendarListed> | string> => {
    try {
        const response = await fetch(`${base}/calendar/createCalendar`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(calendar_info)
        });
        const results = await response.json();
        if (response.ok) {
            if (results.status) {
                let calendarItem: CalendarListed = {calendar_id: results.calendar_id, name: calendar_info.name,
                    description: calendar_info.description, is_default: calendar_info.is_default, events: []};
                const newListOfCalendars = new Set<CalendarListed>(listOfCalendars);
                newListOfCalendars.add(calendarItem);
                return newListOfCalendars;
            }
            else {
                return results.message;
            }
        }
        return listOfCalendars;
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return listOfCalendars;
    }
}

const makeNewEvent = async (event_info: Event, base: string, 
    listOfCalendars: Set<CalendarListed>): Promise<Set<CalendarListed> | string> => {
    try {
        const response = await fetch(`${base}/calendar/createEvent`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(event_info)
        });
        const results = await response.json();
        if (response.ok) {
            if (results.status) {
                const newListOfCalendars = new Set<CalendarListed>(listOfCalendars);
                newListOfCalendars.forEach(calendar => {
                    if (calendar.calendar_id === event_info.calendar_id) {
                        event_info.event_id = results.event_id;
                        calendar.events.push(event_info);
                    }
                });
                return newListOfCalendars;
            }
            else {
                return results.message;
            }
        }
        return listOfCalendars;
    }
    catch (err) {
        if (err instanceof Error) alert("Network Error:" + err.message);
        return listOfCalendars;
    }
}

export {loadCalendar, addOrRemoveCalendar, makeNewCalendar, makeNewEvent};