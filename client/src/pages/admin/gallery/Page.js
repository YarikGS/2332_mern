import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {Loader} from '../../../components/Loader'
import {VideosList} from '../../../components/VideosList'

import {useMessage} from '../../../hooks/message.hook'
import {useHistory} from 'react-router-dom'

export const AdminGalleryPage = () => {
	const [videos, setVideos] = useState([])
	const {loading, error, request, clearError} = useHttp()

	const history = useHistory()
	const message = useMessage()
	// const {loading, error, request, clearError} = useHttp()
	const [url, setUrl] = useState('')
	const [caption, setCaption] = useState('')

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	const createHandler = async () => {
		try {
			const data = await request( '/api/gallery/add', 'POST', {url, caption})
			console.log(data)
			fetchVideos()
			// history.push(`/admin_gallery/${data.gallery._id}`)
		} catch(e) {}
	}

	const auth = "auth"


	const fetchVideos = useCallback( async () => {
		try {
			const fetched = await request('api/gallery/', 'GET', null)

			setVideos(fetched)
		} catch(e) {}
	}, [request])

	useEffect( () => {
		fetchVideos()
	}, [fetchVideos])

	if (loading) {
		return <Loader />
	}
	return(
		<>
			<div>
				<h3>Admin Gallery Page</h3>
			</div>
			<div className="row">
				<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>

					<div className="card blue darken-1">
				        <div className="card-content white-text">
				        	<span className="card-title">Add new Vimeo Video</span>
				        	<div className="row">
						        <div className="input-field">
						          <input onChange={e => setUrl(e.target.value)} id="url" type="text" name="url" />
						          <label htmlFor="url">Vimeo url</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="text" />
						          <label htmlFor="caption">Caption</label>
						        </div>
					    	</div>
				        </div>
				        <div className="card-action">
				        	<button onClick={createHandler} disabled={loading} className="btn green darken-2" style={{ marginRight: 10 }}>Add Video</button>
				        </div>
				    </div>

				</div>
			</div>

			{ !loading && videos && <VideosList videos={videos} auth={auth} /> }
		</>
	)
}