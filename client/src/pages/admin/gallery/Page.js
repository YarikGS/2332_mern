import React, {useState, useEffect, useCallback, useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {Loader} from '../../../components/Loader'
import {VideosList} from '../../../components/VideosList'
import {AuthContext} from '../../../context/AuthContext'
import {useMessage} from '../../../hooks/message.hook'
import {useHistory, useLocation} from 'react-router-dom'

export const AdminGalleryPage = () => {
	const [videos, setVideos] = useState([])
	const {loading, error, request, clearError} = useHttp()
	const auth = useContext(AuthContext)
	const history = useHistory()
	const message = useMessage()
	const itemData = useLocation().state
	// const {loading, error, request, clearError} = useHttp()
	const [image, setImage] = useState(null)
	const [url, setUrl] = useState('')
	const [caption, setCaption] = useState('')
	const [category, setCategory] = useState('5eb6b3f65f9d1d97c7f4bad3')
	const [type, setType] = useState('gallery')

	let load_category = ''

	console.log(`category to load is`)
	if ( itemData !== null &&  itemData !== undefined ) {
		console.log(`category to load ${itemData.category}`)
		load_category = `?category=${itemData.category}`

	}

	useEffect( () => {
		message(error)
		clearError()
	}, [error, message, clearError] )

	useEffect( () => {
		window.M.updateTextFields()
	}, [] )

	// const createHandler = async () => {
	// 	try {
	// 		const data = await request( '/api/gallery/add', 'POST', {url, caption, category, type}, {'Authorization': `Bearer ${auth.token}`})
	// 		console.log(data)
	// 		fetchVideos()
	// 		// history.push(`/admin_gallery/${data.gallery._id}`)
	// 	} catch(e) {}
	// }

	const createHandler = async () => {
		try {
			const form_data = new FormData()
	   		form_data.append('image', image)
	   		form_data.append('caption', caption)
	   		form_data.append('url', url)
	   		form_data.append('category', category)
	   		form_data.append('type', type)
				// console.log('form data b4 send', form_data.get('image'))
			const data = await request( '/api/gallery/add', 'POST', form_data, {'Content-Type': 'multipart/form-data',
		 'Authorization': `Bearer ${auth.token}` })
		 // const data = await request( '/api/gallery_category/remove/5ebe1eeb0e77f091e00ebc48', 'GET', null, {
		 // 'Authorization': `Bearer ${auth.token}` })

			fetchVideos()
		} catch(e) {}
	}

	const fetchVideos = useCallback( async () => {
		try {
			const fetched = await request(`api/gallery/all/gallery${load_category}`, 'GET', null)

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

				        	<div className="file-field input-field">
							      <div className="btn">
							        <span>Slider Image</span>
							        <input onChange={e => setImage(e.target.files[0])} type="file" name="slider" />
							      </div>
							      <div className="file-path-wrapper">
							        <input className="file-path validate" type="text" />
							      </div>
							    </div>

						        <div className="input-field">
						          <input onChange={e => setUrl(e.target.value)} id="url" type="text" name="url" />
						          <label htmlFor="url">Vimeo url</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="text" />
						          <label htmlFor="caption">Caption</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setCategory(e.target.value)} id="category" type="text" name="text" />
						          <label htmlFor="category">Category</label>
						        </div>
					    	</div>
				        </div>
				        <div className="card-action">
				        	<button onClick={createHandler} disabled={loading} className="btn green darken-2" style={{ marginRight: 10 }}>Add Video</button>
				        </div>
				    </div>

				</div>
			</div>

			{ !loading && videos && <VideosList videos={videos} auth='auth' /> }
		</>
	)
}
