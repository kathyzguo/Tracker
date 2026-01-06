import type {Calendar, Event, CalendarCreate} from "../../interfaces/CalendarInterface"
import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "./Taskbar"

const Calendars = ({base, userID} : {base: String, userID: number}) => {
    const navigate = useNavigate();
    const [calendar, setCalendar] = useState<Calendar>({name: "", description: "", events: []})

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
                    console.log(results);
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error:" + err.message);
            }    
        }
        loadCalendar();
    }, []);

    const getSpecificCalendar = async (calendarID: number) => {
        try {
            const jsonObj = {calendar_id: calendarID};
            const response = await fetch(`${base}/calendar/getCalendar`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(jsonObj)
            });
            const results = await response.json();
            if (response.ok) {
                console.log(results);
            }
        }
        catch (err) {
            if (err instanceof Error) alert("Network Error:" + err.message);
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
                console.log(results);
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
                console.log(results);
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
        </div>
    )
};

export default Calendars