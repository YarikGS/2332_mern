import {useState, useCallback} from 'react'

export const useHttp = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	const request = useCallback( async ( url, method = 'GET', body = null, headers = {} ) => {
		setLoading(true)
		try {
			if (body) {
				
				if ( headers['Content-Type'] === undefined ) {
					headers['Content-Type'] = 'application/json'
					body = JSON.stringify(body)
				}
				else if( headers['Content-Type'] === 'multipart/form-data' ) {
					delete headers['Content-Type']
				}
			}

			let response
			response = await fetch(url, {method, body, headers})
			// console.log('headers is ', headers)
			// if ( headers === 0 ) {
			// 	response = await fetch(url, {method, body})
			// }else{
			// 	response = await fetch(url, {method, body, headers})
			// }
			
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.message || 'Request response error')
			}

			setLoading(false)

			return data
		} catch(e) {
			setLoading(false)
			setError(e.message)
			throw e
		}
	}, [])

	const clearError = useCallback( () => setError(null), [] )

	return { loading, request, error, clearError }
}