import {useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "./Taskbar"

const Calendars = ({base, userID} : {base: String, userID: number}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        async function loadCalendar() {
            try {
                const jsonObj = {id: userID};
                const response = await fetch(`${base}/calendar/getDefault`, {
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
    }, [])

    return (<Taskbar type = {1}/>)
};

export default Calendars