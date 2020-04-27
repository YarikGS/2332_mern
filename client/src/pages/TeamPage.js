import React, {useState, useEffect, useCallback} from 'react'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {TeamList} from '../components/TeamList'

export const TeamPage = () => {
	const [team, setTeam] = useState([])
	const {loading, request} = useHttp()

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
				<h3>Team Page</h3>
				<a href="/login" className="btn blue darken-3">Auth Page</a>
			</div>
			{ !loading && team && <TeamList team={team} /> }
		</>
	)
}