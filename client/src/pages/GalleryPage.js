import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {VideosList} from '../components/VideosList'

export const GalleryPage = () => {
	const [videos, setVideos] = useState([])
	const {loading, request} = useHttp()

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
				<h3>Gallery Page</h3>
				<a href="/login" className="btn blue darken-3">Auth Page</a>
			</div>
			{ !loading && videos && <VideosList videos={videos} /> }
		</>
	)
}