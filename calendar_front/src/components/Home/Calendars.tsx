import type {Calendar, CalendarListed, Event, EventJSON, CalendarCreate} from "../../interfaces/CalendarInterface"
import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "./Taskbar"

const Calendars = ({base, userID} : {base: String, userID: number}) => {
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState<Calendar>({name: "", description: "", events: []})
    const listOfCalendars: Set<CalendarListed> = new Set();

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        async function loadCalendar() {
            try {
                const jsonObj = {user_id: userID};
                const response = await fetch(`${base}/calendar/getCalendars`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(jsonObj)
                });
                const results = await response.json();
                if (response.ok && results.status) {
                    for (const calendar of results.calendars) {
                        let {user_id, id, created_at, updated_at, ...destructure} = calendar;
                        const getEvents: Event[] = await getSpecificCalendar(calendar.id);
                        let calendarItem: CalendarListed = {...destructure, calendar_id: calendar.id, events: getEvents};
                        if (calendarItem.is_default) {
                            const {calendar_id, is_default, ...destructure} = calendarItem;
                            setCalendar(destructure);
                        }
                        listOfCalendars.add(calendarItem);
                    };
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error:" + err.message);
            }    
        }
        loadCalendar();
    }, []);

    function turnToEvent(calendarEvents: EventJSON): Event {
        const start_date = new Date(calendarEvents.start_time);
        const end_date = (calendarEvents.end_time === "") ? undefined : new Date(calendarEvents.end_time);
        const recur_start_date = (calendarEvents.recurrence_start === "") ? undefined : new Date(calendarEvents.recurrence_start);
        const recur_end_date = (calendarEvents.recurrence_end === "") ? undefined : new Date(calendarEvents.recurrence_end);
        const {created_at, updated_at, id, ...destructure} = calendarEvents;
        return {...destructure, start_time: start_date, end_time: end_date, recurrence_start: recur_start_date, recurrence_end: recur_end_date}
    } 

    const getSpecificCalendar = async (calendarID: number): Promise<Event[]> => {
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

    const setCalendarTo = (findID: number) => {
        for (const c of listOfCalendars) {
            if (c.calendar_id === findID) {
                const {calendar_id, is_default, ...destructure} = c;
                setCalendar(destructure);
            }
        }
    }

    const makeNewCalendar = async (calendar_info: CalendarCreate) => {
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
                    listOfCalendars.add(calendarItem);
                }
                else {
                    console.log(results.message); //DO SOMETHING HERE
                }
            }
        }
        catch (err) {
            if (err instanceof Error) alert("Network Error:" + err.message);
        }
    }

    const makeNewEvent = async (event_info: Event) => {
        try {
            const response = await fetch(`${base}/calendar/createEvent`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(event_info)
            });
            const results = await response.json();
            if (response.ok) {
                if (results.status) {
                    listOfCalendars.forEach(calendar => {
                        if (calendar.calendar_id === event_info.calendar_id) {
                            calendar.events.push(event_info);
                        }
                    });
                }
                else {
                    console.log(results.message); //DO SOMETHING HERE
                }
            }
        }
        catch (err) {
            if (err instanceof Error) alert("Network Error:" + err.message);
        }
    }

    return (
        <div>
            <Taskbar type = {1}/>
            <button onClick = {() => makeNewCalendar({user_id: 21, name: "OnEzra", 
                description: "We are doing this", is_default: false})}>Create Calendar</button>
            <button onClick = {() => getSpecificCalendar(5)}>Get Calendar</button>
            <button onClick = {() => makeNewEvent({calendar_id: 4, name: "NewEzra", description: "FOR REAL THIS TIME", 
                start_time: new Date("2026-01-05T19:30:00.000Z"), all_day: false, recurrence: "NONE"})}>Make new Event</button>
            <button onClick = {() => console.log("Default: ", calendar)}>Print</button>
        </div>
    )
};

export default Calendars