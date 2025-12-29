import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "./Taskbar"

const MainPage = ({base, userID}: {base: String, userID: number}) => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState("");

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    useEffect(() => {
        async function loadName() {
            try {
                const jsonObj = {id: userID};
                const response = await fetch(`${base}/main/getName`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(jsonObj)
                });
                const results = await response.json();
                if (response.ok && results.status) {
                    setDisplayName(results.name)
                }
            }
            catch (err) {
                if (err instanceof Error) alert("Network Error:" + err.message);
            }    
        }
        loadName();
    }, [])

    return (
        <div>
            <Taskbar/>
            <div className = "mainTitle">
                <h1>Welcome back, {displayName}</h1>
                <p>What would you like to track today?</p>
            </div>
            <div className = "mainFlowBlock">
                <div className = "mainBlock">
                    <h2>Calendars</h2>
                    <div className = "mainBlockListing">
                        <div className = "mainNewStart">
                            <h3>Start new calendar</h3>
                        </div>
                    </div>
                </div>
                <div className = "mainBlock">
                    <h2>Goals</h2>
                    <div className = "mainBlockListing">
                        <div className = "mainNewStart">
                            <h3>Log new goal</h3>
                        </div>
                    </div>
                </div>
                <div className = "mainBlock">
                    <h2>Time Tracker</h2>
                    <div className = "mainBlockListing">
                        <div className = "mainNewStart">
                            <h3>Log time spent</h3>
                        </div>
                    </div>
                </div>
                <div className = "mainBlock">
                    <h2>Custom Trackers</h2>
                    <div className = "mainBlockListing">
                        <div className = "mainNewStart">
                            <h3>Create new tracker</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage