import {useEffect} from "react"
import type {Event, EventJSON} from "../../interfaces/CalendarInterface"

const EditEvent = ({event}: {event: Event | undefined}) => {

    useEffect(() => {
        if (event) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [])

    return (
        event &&
        <div style = {{minHeight: "100vh", minWidth: "100vw", display: "flex", position: "fixed", top: "0", right: "0", left: "0", bottom: "0",
            zIndex: "1000", justifyContent: "center", alignItems: "center", backgroundColor: "#0000001e", border: "0"}}>
            <div className = "border border-5 rounded-3" style = {{width: "470px", padding: "20px", backgroundColor: "white"}}>
                <h2>Event Info</h2>
                <h4>{event.name}</h4>
                <p>{event.description}</p>
                <hr/>
            </div>
        </div>
    )
}

export default EditEvent;

/*
                <form className = "px-4 py-3" noValidate onSubmit = {handleFormSubmission}>
                    <div className = "mb-3">
                        <label htmlFor = "Email" className = "form-label">Email address</label>
                        <input name = "email" type = "email" className = "form-control" id = "Email" placeholder = "Email" onChange = {handleInputChange}/>
                        {formErrors.email && <p className = "text-danger">{formErrors.email}</p>}
                    </div>
                    <div className = "mb-3">
                        <label htmlFor = "Password" className = "form-label">Password</label>
                        <input name = "password" type = "password" className = "form-control" id = "Password" placeholder = "Password" onChange = {handleInputChange}/>
                        {formErrors.password && <p className = "text-danger">{formErrors.password}</p>}
                    </div>
                        <div className = "mb-3">
                            <div className = "form-check">
                                <input name = "stay" type = "checkbox" className = "form-check-input" id = "Check" onChange = {handleBoxChange}/>
                                <label className = "form-check-label" htmlFor = "Check">Stay signed in</label>
                            </div>
                        </div>
                    <button type = "submit" className = "btn btn-primary">Sign in</button>
                </form>
*/