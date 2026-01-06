export interface Calendar {
    name: String,
    description: String,
    events: Event[]
}

export interface Event {
    calendar_id: number,
    name: string,
    description: string,
    start_time: Date,
    end_time?: Date,
    all_day: boolean,
    recurrence: string,
    recurrence_start?: Date
    recurrence_end?: Date 
}

export interface CalendarCreate {
    user_id: number,
    name: string,
    description: string,
    is_default: boolean
}
