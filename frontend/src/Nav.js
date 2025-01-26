import React from 'react';
import {Link} from 'react-router-dom';

const Nav=()=>{
    return(
        <div className={"navbar-styles"}>
            <Link className={"link-styles"} to="/">Register Users</Link>
            <Link className={"link-styles"} to="/bookAppointments">Book Appointments</Link>
            <Link className={"link-styles"} to="/displayAppointments">Display Appointments</Link>
        </div>
    )
}

export default Nav;