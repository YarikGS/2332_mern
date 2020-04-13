import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext'

export const AdminGalleryEditPage = () => {
	const itemId = useParams().id
	const itemData = useLocation().state
	const history = useHistory()
	const message = useMessage()
	const {loading, error, request, clearError} = useHttp()
	const [url, setUrl] = useState(itemData.url)
	const [category, setCategory] = useState(itemData.category)
	const [caption, setCaption] = useState(itemData.caption)
	const [type, setType] = useState('contacts')
	const auth = useContext(AuthContext)

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	const editHandler = async () => {
		try {
			const data = await request( `/api/gallery/update/${itemId}`, 'POST', {url, caption, category, type}, {'Authorization': `Bearer ${auth.token}`})
			console.log(data)
			history.push(`/admin_gallery/${data.gallery._id}`)
		} catch(e) {}
	}


	return(
		<div className="row">
			<h3>Gallery Item Page edit {itemId} </h3>
			<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>

				<div className="card blue darken-1">
			        <div className="card-content white-text">
			        	<span className="card-title">Edit Vimeo Video</span>
			        	<div className="row">
					        <div className="input-field">
					          <input onChange={e => setUrl(e.target.value)} id="url" type="text" name="url" defaultValue={itemData.url} />
					          <label htmlFor="url">Vimeo url</label>
					        </div>
					        <div className="input-field">
					          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="caption" defaultValue={itemData.caption} />
					          <label htmlFor="caption">Caption</label>
					        </div>
					        <div className="input-field">
					          <input onChange={e => setCategory(e.target.value)} id="category" type="text" name="category" defaultValue={itemData.category} />
					          <label htmlFor="category">Category</label>
					        </div>
				    	</div>
			        </div>
			        <div className="card-action">
			        	<button onClick={editHandler} disabled={loading} className="btn yellow darken-2" style={{ marginRight: 10 }}>Edit Video</button>
			        </div>
			    </div>

			</div>
		</div>
	)
}
