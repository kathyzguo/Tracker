import {useState} from "react"
import type {CalendarListed, Event} from "../../interfaces/CalendarInterface"
import EditEvent from "./EditEvent"

const CalendarComp = ({calendars}: {calendars: Set<CalendarListed>}) => {
    const [currentMonth, setCurrentMonth] = useState(0);
    const [eventClicked, setEventClicked] = useState<Event | undefined>(undefined);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
        "November", "December"]
    const oddmonths = [1, 3, 5, 8, 10];

    function determineDays(month: number): number {
        if (oddmonths.indexOf(month) >= 0) {
            if (oddmonths.indexOf(month) == 0) {
                let x = new Date()
                if (x.getFullYear() % 4 == 0) {
                    return 29;
                }
                else {
                    return 28;
                }
            }
            else {
                return 30;
            }
        }
        else {
            return 31;
        }
    }

    function determineEvents(month: number, calendars: Set<CalendarListed>): Event[] {
        const activeEvents: Event[] = [];
        for (const c of calendars) {
            for (const event of c.events) {
                if (month === event.start_time.getMonth()) activeEvents.push(event);
            }
        }
        return activeEvents;
    }

    function determineDayWEvent(day: number, events: Event[]): Event[] {
        const listOfEvents: Event[] = [];
        for (const event of events) {
            if (event.start_time.getDay() === day) listOfEvents.push(event);
        }
        return listOfEvents
    }

    const numOfDays = determineDays(currentMonth);
    let dayStart = 4;
    for (let i = 0; i < currentMonth; i++) {
        dayStart = (dayStart + determineDays(i)) % 7;
    }
    const activeEvents = determineEvents(currentMonth, calendars);

    let gridTemplateRows = "6fr 3fr repeat(5, 12fr)";
    let aspectRatio = "1.217";
    let numRows = 35;
    if (dayStart + numOfDays > 35) {
        gridTemplateRows = "6fr 3fr repeat(6, 12fr)";
        aspectRatio = "1.037";
        numRows = 42;
    }
    else if (dayStart + numOfDays <= 28) {
        gridTemplateRows = "6fr 3fr repeat(4, 12fr)";
        aspectRatio = "1.474";
        numRows = 28;
    }

    return (
            <div key = {"calendarFrame" + currentMonth} className = "calendarFrame" style = {{
                gridTemplateRows: `${gridTemplateRows}`, aspectRatio: `${aspectRatio}`}}>
                <img src = "ArrowIcon_Left.png" id = "calLeftArrow" onClick = {() => {
                    if (currentMonth > 0) setCurrentMonth(currentMonth - 1)}}/>
                <h2 id = "monthHeading">{months[currentMonth] + " 2026"}</h2>
                <img src = "ArrowIcon_Right.png" id = "calRightArrow" onClick = {() => {
                    if (currentMonth < 11) setCurrentMonth(currentMonth + 1)}}/>
                <h3>Sunday</h3>
                <h3>Monday</h3>
                <h3>Tuesday</h3>
                <h3>Wednesday</h3>
                <h3>Thursday</h3>
                <h3>Friday</h3>
                <h3>Saturday</h3>
                {Array.from({length: dayStart}, (j2, i2) => (
                    <div key = {"blankDate" + i2}></div>
                ))}
                {Array.from({length: numOfDays}, (j2, i2) => {
                    const borderRight = ((i2 + dayStart + 1) % 7 == 0) ? "dashed #ffd5fb 3px" : "";
                    const borderBottom = ((i2 + dayStart) >= numRows - 7) ? "dashed #ffd5fb 3px" : "";
                    const events = determineDayWEvent(i2, activeEvents);
                    return (
                    <div key = {"withNumDate" + i2} style = {{
                        borderRight: `${borderRight}`, borderBottom: `${borderBottom}`}}>
                        <h4>{i2 + 1}</h4>
                        {Array.from(events).map(event => (
                        <button onClick = {() => setEventClicked(event)}>
                            {event.name}
                            <br/>
                            {event.start_time.toLocaleDateString() + " " + event.start_time.toLocaleTimeString(
                                "en-US", {hour: "2-digit", minute: "2-digit", hour12: false })}
                            {(event.end_time) ? " to " + event.end_time.toLocaleDateString() + " " + event.end_time.toLocaleTimeString(
                                "en-US", {hour: "2-digit", minute: "2-digit", hour12: false }) : ""}
                        </button>)
                    )}
                    </div>
                    )
                })}
                {Array.from({length: numRows - (dayStart + numOfDays)}, (j2, i2) => {
                    const x = dayStart + numOfDays + i2;
                    const borderRight = ((x + 1) % 7 == 0) ? "dashed #ffd5fb 3px" : "";
                    const borderBottom = (x > numRows - 7) ? "dashed #ffd5fb 3px" : "";
                    return <div key = {"blankDateAfter" + i2} style = {{
                        borderRight: `${borderRight}`, borderBottom: `${borderBottom}`}}></div>
                })}
                {eventClicked && <EditEvent event = {eventClicked}/>}
            </div>
    )
}

export default CalendarComp;