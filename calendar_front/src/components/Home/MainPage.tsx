import {useState, useEffect} from "react"
import {useNavigate} from 'react-router-dom'

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
            <p>{displayName}</p>
            <p>HERE</p>
        </div>
    )
}

export default MainPage