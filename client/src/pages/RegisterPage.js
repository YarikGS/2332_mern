import React, {useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

export const RegisterPage = () => {
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [form, setForm] = useState({
		email: '', password: '', confirm_password: '', username: ''
	})

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	const changeHandler = event => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const registerHandler = async () => {
		try {
			const data = await request( '/api/auth/register', 'POST', {...form})
			message(data.message)
		} catch(e) {}
	}

	return(
		<div className="row">
			<div className="col s6 offset-s3">
				<h1>2332 Register Admin Page</h1>
				<div className="card green darken-1">
			        <div className="card-content white-text">
			        	<span className="card-title">Create Admin</span>
			        	<div className="row">
					        <div className="input-field">
					          <input onChange={changeHandler} id="email" type="text" name="email" className="yellow-input" />
					          <label htmlFor="email">Email</label>
					        </div>
					        <div className="input-field">
					          <input onChange={changeHandler} id="username" type="text" name="username" className="yellow-input" />
					          <label htmlFor="username">Username</label>
					        </div>
					        <div className="input-field">
					          <input onChange={changeHandler} id="password" type="password" name="password" className="yellow-input" />
					          <label htmlFor="password">Password</label>
					        </div>
					        <div className="input-field">
					          <input onChange={changeHandler} id="confirm_password" type="password" name="confirm_password" className="yellow-input" />
					          <label htmlFor="confirm_password">Confirm Password</label>
					        </div>
				    	</div>
			        </div>
			        <div className="card-action">
			        	<button onClick={registerHandler} disabled={loading} className="btn yellow darken-4" style={{ marginRight: 10 }}>Create Admin</button>
			        	<a href="/login" className="btn blue darken-3">Login</a>
			        </div>
			    </div>
			</div>
		</div>
	)
}
