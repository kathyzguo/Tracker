import {BrowserRouter, Routes, Route} from "react-router-dom"
import {useState} from "react"
import LoginInputs from './LoginHandler/LoginInputs.tsx'
import CreateLogin from './LoginHandler/CreateLogin.tsx'
import MainPage from './Home/MainPage.tsx'

function App({apiBase}: {apiBase: string}) {
    const [userID, setUserID] = useState(-1)
    return (
    <BrowserRouter>
        <Routes>
            <Route path = "/" element = {<LoginInputs base = {apiBase} setID = {setUserID}/>}/>
            <Route path = "/create" element = {<CreateLogin base = {apiBase}/>}/>
            <Route path = "/home" element = {<MainPage base = {apiBase} userID = {userID}/>}/>
        </Routes>
    </BrowserRouter>
    )
}

export default App
