import {useEffect} from "react"
import {useNavigate} from 'react-router-dom'
import Taskbar from "./Taskbar"

const CTrackers = ({base, userID} : {base: String, userID: number}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (userID === -1) {
            navigate("/");
        }
    }, [userID, navigate]); 

    return (<Taskbar type = {4}/>)
};

export default CTrackers