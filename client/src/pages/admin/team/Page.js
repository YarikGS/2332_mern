import React, {useState, useEffect, useCallback, useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {Loader} from '../../../components/Loader'
import {TeamList} from '../../../components/TeamList'
import {AuthContext} from '../../../context/AuthContext'
import {useMessage} from '../../../hooks/message.hook'
import {useHistory} from 'react-router-dom'

export const AdminTeamPage = () => {
	const [team, setTeam] = useState([])
	const {loading, error, request, clearError} = useHttp()

	const history = useHistory()
	const message = useMessage()
	// const {loading, error, request, clearError} = useHttp()
	const [image, setImage] = useState(null)
	const [caption, setCaption] = useState('')
	const [text, setText] = useState('')
	const [instagram, setInstagram] = useState('')
	const auth = useContext(AuthContext)

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	const createHandler = async () => {
		try {				
			const form_data = new FormData()
	   		form_data.append('image', image)
	   		form_data.append('caption', caption)
	   		form_data.append('text', text)
				// console.log('form data b4 send', form_data.get('image'))
			const data = await request( '/api/team/add', 'POST', form_data, {'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${auth.token}`})
			fetchTeam()
		} catch(e) {}
	}


	const fetchTeam = useCallback( async () => {
		try {
			const fetched = await request('api/team/', 'GET', null)

			setTeam(fetched)
		} catch(e) {}
	}, [request])

	useEffect( () => {
		fetchTeam()
	}, [fetchTeam])

	if (loading) {
		return <Loader />
	}
	return(
		<>
			<div>
				<h3>Admin Team Page</h3>
			</div>
			<div className="row">
				<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>

					<div className="card blue darken-1">
				        <div className="card-content white-text">
				        	<span className="card-title">Add new Team Member</span>
				        	<div className="row">
				        		<div className="file-field input-field">
							      <div className="btn">
							        <span>Person Image</span>
							        <input onChange={e => setImage(e.target.files[0])} type="file" name="iamge" />
							      </div>
							      <div className="file-path-wrapper">
							        <input className="file-path validate" type="text" />
							      </div>
							    </div>
						        <div className="input-field">
						          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="caption" />
						          <label htmlFor="caption">Caption</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setText(e.target.value)} id="text" type="text" name="text" />
						          <label htmlFor="text">Text</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setInstagram(e.target.value)} id="instagram" type="text" name="instagram" />
						          <label htmlFor="instagram">Instagram</label>
						        </div>
					    	</div>
				        </div>
				        <div className="card-action">
				        	<button onClick={createHandler} disabled={loading} className="btn green darken-2" style={{ marginRight: 10 }}>Add Team</button>
				        </div>
				    </div>

				</div>
			</div>

			{ !loading && team && <TeamList team={team} auth='auth' /> }
		</>
	)
}