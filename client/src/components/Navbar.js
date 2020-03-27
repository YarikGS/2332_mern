import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

export const Navbar = () => {
	const history = useHistory()
	const auth = useContext(AuthContext)

	const logoutHandler = event => {
		event.preventDefault()
		auth.logout()
		history.push('/')
	}

	return (
		<nav>
		    <div className="nav-wrapper blue darken-1" style={{padding: '0 2rem'}}>
		      <a href="/" className="brand-logo">Welcome, {auth.username} at 2332 admin page</a>
		      <ul id="nav-mobile" className="right hide-on-med-and-down">
		      <li><NavLink to="/admin_gallery">Gallery Items</NavLink></li>
		        <li><NavLink to="/admin_slider">Slider Items</NavLink></li>
		        <li><NavLink to="/admin_team">Team Items</NavLink></li>
		        <li><a href="/" onClick={logoutHandler}>Logout</a></li>
		      </ul>
		    </div>
		  </nav>
	)
}