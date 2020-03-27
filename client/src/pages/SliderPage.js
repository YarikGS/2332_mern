import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {SliderList} from '../components/SliderList'

export const SliderPage = () => {
	const [slider, setSlider] = useState([])
	const {loading, request} = useHttp()

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
				<h3>Slider Page</h3>
				<a href="/login" className="btn blue darken-3">Auth Page</a>
			</div>
			{ !loading && slider && <SliderList slider={slider} /> }
		</>
	)
}