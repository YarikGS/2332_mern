import React, {useState, useEffect, useCallback} from 'react'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {VideoFrame} from '../components/Video'

export const GalleryItemPage = () => {
	const {request, loading} = useHttp()
	const [video, setVideo] = useState(null)
	const videoId = useParams().id

	const getVideo = useCallback( async () => {
		try {
			const fetched =	await request(`/api/gallery/${videoId}`, 'GET', null)
			setVideo(fetched)
		} catch(e) {}
	}, [videoId, request])

	useEffect( () => {
		getVideo()
	}, [getVideo])

	if (loading) {
		return <Loader />
	}



	return(
		<>
			{ !loading && video && <VideoFrame video={video} /> }
		</>
	)
}
