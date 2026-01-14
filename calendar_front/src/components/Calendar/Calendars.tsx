import type {CalendarListed, Event, EventJSON, CalendarCreate} from "../../interfaces/CalendarInterface"
import {useRef, useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "../Home/Taskbar"
import {loadCalendar, addOrRemoveCalendar, makeNewCalendar, makeNewEvent} from "./CalendarAPI"
import CalendarComp from "./CalendarComp";

const Calendars = ({base, userID} : {base: string, userID: number}) => {
    const navigate = useNavigate();
    const [activeCalendars, setActiveCalendars] = useState<Set<CalendarListed>>(new Set<CalendarListed>());
    const [listOfCalendars, setListOfCalendars] = useState<Set<CalendarListed>>(new Set<CalendarListed>());
    const taskbarDiv = useRef<HTMLDivElement>(null);
    const [heightOfTask, setHeightOfTask] = useState(0);

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        const setCalendars = async () => {
            setListOfCalendars(await loadCalendar(userID, base));
        }
        setCalendars();
    }, []);

    useEffect(() => {
        if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        const resizing = () => {
            if (taskbarDiv.current) setHeightOfTask(taskbarDiv.current.offsetHeight);
        }
        window.addEventListener("resize", resizing);
        return () => {
            window.removeEventListener("resize", resizing);
        }
    }, []);

    return (
        <div>
            <div ref = {taskbarDiv}>
                <Taskbar type = {1}/>
            </div>
            <div className = "forNav">
                <nav className = "leftnav" style = {{top: `${heightOfTask}px`}}>
                    <h2>Active Calendars</h2>
                    {Array.from(listOfCalendars).sort((a, b) => a.calendar_id - b.calendar_id).map(c => (
                        <label key = {"keyCalendar" + c.calendar_id}>
                            <input type = "checkbox" id = {"calendar" + c.calendar_id} onChange = {(e) => {
                                for (const testC of listOfCalendars) {
                                    if (testC.calendar_id === c.calendar_id) {
                                        const newActiveCalendars = new Set<CalendarListed>(activeCalendars);
                                        (e.target.checked) ? newActiveCalendars.add(testC) : newActiveCalendars.delete(testC);
                                        setActiveCalendars(newActiveCalendars);
                                    }
                                }
                            }}/>
                            {c.name}
                        </label>
                    ))}
                </nav>
                <CalendarComp calendars = {activeCalendars}/>
            </div>
        </div>
    )
};

export default Calendars