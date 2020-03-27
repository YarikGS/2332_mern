import React, {useState, useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {useHistory, useParams, useLocation} from 'react-router-dom'

export const AdminTeamEditPage = () => {
	const itemId = useParams().id
	const itemData = useLocation().state
	const history = useHistory()
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [image, setImage] = useState(null)
	const [caption, setCaption] = useState(itemData.caption)
	const [text, setText] = useState(itemData.text)

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	const editHandler = async () => {
		try {
			const form_data = new FormData()
	   		form_data.append('image', image)
	   		form_data.append('caption', caption)
	   		form_data.append('text', text)
			const data = await request( `/api/team/update/${itemId}/${itemData.imageId}`, 'POST', form_data, {'Content-Type': 'multipart/form-data'})
			history.push(`/admin_team`)
		} catch(e) {}
	}


	return(
		<div className="row">
			<h3>Team member Page edit {itemId} </h3>
			<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>

				<div className="card blue darken-1">
			        <div className="card-content white-text">
			        	<span className="card-title">Edit Team Member</span>
			        	<img src={itemData.image} alt="image" style={{width: '350px'}}  />
			        	<div className="row">
			        		<div className="file-field input-field">
							    <div className="btn">
							        <span>Team Image</span>
							        <input onChange={e => setImage(e.target.files[0])} type="file" name="image" />
							    </div>
							    <div className="file-path-wrapper">
							        <input className="file-path validate" type="text" />
							    </div>
							</div>
					        <div className="input-field">
					          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="caption" defaultValue={itemData.caption} />
					          <label htmlFor="caption">Caption</label>
					        </div>

					        <div className="input-field">
					          <input onChange={e => setText(e.target.value)} id="text" type="text" name="text" defaultValue={itemData.text} />
					          <label htmlFor="text">Text</label>
					        </div>
				    	</div>
			        </div>
			        <div className="card-action">
			        	<button onClick={editHandler} disabled={loading} className="btn yellow darken-2" style={{ marginRight: 10 }}>Edit Member</button>
			        </div>
			    </div>

			</div>
		</div>
	)
}
