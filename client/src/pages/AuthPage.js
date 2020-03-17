import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from '../context/AuthContext'

export const AuthPage = () => {
	const auth = useContext(AuthContext)
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [form, setForm] = useState({
		email: '', password: ''
	})

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	const changeHandler = event => {
		setForm({ ...form, [event.target.name]: event.target.value })
	}

	const loginHandler = async () => {
		try {
			const data = await request( '/api/auth/login', 'POST', {...form})
			auth.login(data.token, data.userId, data.username)
		} catch(e) {}
	}


	return(
		<div className="row">
			<div className="col s6 offset-s3">
				<h1>2332 Login Page</h1>
				<div className="card blue darken-1">
			        <div className="card-content white-text">
			        	<span className="card-title">Login</span>
			        	<div className="row">
					        <div className="input-field">
					          <input onChange={changeHandler} id="email" type="text" name="email" className="yellow-input" value={form.email} />
					          <label htmlFor="email">Email</label>
					        </div>
					        <div className="input-field">
					          <input onChange={changeHandler} id="password" type="password" name="password" className="yellow-input" value={form.password} />
					          <label htmlFor="password">Password</label>
					        </div>
				    	</div>
			        </div>
			        <div className="card-action">
			        	<button onClick={loginHandler} disabled={loading} className="btn yellow darken-4" style={{ marginRight: 10 }}>Login</button>
			        	<a href="/register" className="btn green darken-3">Register</a>
			        </div>
			    </div>
			</div>
		</div>
	)
}