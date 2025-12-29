import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useState} from "react"
import LoginInputs from './LoginHandler/LoginInputs.tsx'
import CreateLogin from './LoginHandler/CreateLogin.tsx'
import MainPage from './Home/MainPage.tsx'
import Calendars from './Home/Calendars.tsx'
import Goals from './Home/Goals.tsx'
import TTracker from './Home/TTracker.tsx'
import CTrackers from './Home/CTrackers.tsx'

function App({apiBase}: {apiBase: string}) {
    const [userID, setUserID] = useState(-1)
    return (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<LoginInputs base = {apiBase} setID = {setUserID}/>}/>
            <Route path = "/create" element = {<CreateLogin base = {apiBase}/>}/>
            <Route path = "/home" element = {<MainPage base = {apiBase} userID = {userID}/>}/>
            <Route path = "/calendars" element = {<Calendars base = {apiBase}/>}/>
            <Route path = "/goals" element = {<Goals base = {apiBase}/>}/>
            <Route path = "/time_tracker" element = {<TTracker base = {apiBase}/>}/>
            <Route path = "/custom_trackers" element = {<CTrackers base = {apiBase}/>}/>
        </Routes>
    </BrowserRouter>
    )
}

export default App
