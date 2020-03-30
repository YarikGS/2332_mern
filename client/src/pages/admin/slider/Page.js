import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {Loader} from '../../../components/Loader'
import {SliderList} from '../../../components/SliderList'

import {useMessage} from '../../../hooks/message.hook'
import {useHistory} from 'react-router-dom'

export const AdminSliderPage = () => {
	const [slider, setSlider] = useState([])
	const {loading, error, request, clearError} = useHttp()

	const history = useHistory()
	const message = useMessage()
	// const {loading, error, request, clearError} = useHttp()
	const [image, setImage] = useState(null)
	const [caption, setCaption] = useState('')
	const [text, setText] = useState('')

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
			const data = await request( '/api/slider/add', 'POST', form_data, {'Content-Type': 'multipart/form-data'})
			fetchSlider()
		} catch(e) {}
	}

	const auth = "auth"


	const fetchSlider = useCallback( async () => {
		try {
			const fetched = await request('api/slider/', 'GET', null)

			setSlider(fetched)
		} catch(e) {}
	}, [request])

	useEffect( () => {
		fetchSlider()
	}, [fetchSlider])

	if (loading) {
		return <Loader />
	}
	return(
		<>
			<div>
				<h3>Admin Slider Page</h3>
			</div>
			<div className="row">
				<div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>

					<div className="card blue darken-1">
				        <div className="card-content white-text">
				        	<span className="card-title">Add new Slider</span>
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
						          <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="text" />
						          <label htmlFor="caption">Caption</label>
						        </div>
						        <div className="input-field">
						          <input onChange={e => setText(e.target.value)} id="text" type="text" name="text" />
						          <label htmlFor="text">Text</label>
						        </div>
					    	</div>
				        </div>
				        <div className="card-action">
				        	<button onClick={createHandler} disabled={loading} className="btn green darken-2" style={{ marginRight: 10 }}>Add Slider</button>
				        </div>
				    </div>

				</div>
			</div>

			{ !loading && slider && <SliderList slider={slider} auth={auth} /> }
		</>
	)
}