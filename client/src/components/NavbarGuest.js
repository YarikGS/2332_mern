import React from 'react'
import {NavLink, useHistory} from 'react-router-dom'

export const NavbarGuest = () => {
	const history = useHistory()

	return (
		<nav>
		    <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
		      <ul id="nav-mobile" className="right hide-on-med-and-down">
		        <li><NavLink to="/">Gallery Items</NavLink></li>
		        <li><NavLink to="/slider">Slider Items</NavLink></li>
		        <li><NavLink to="/team">Team Items</NavLink></li>
		      </ul>
		    </div>
		  </nav>
	)
}