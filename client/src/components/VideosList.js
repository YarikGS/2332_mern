import React, {setState, useContext} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'

export const VideosList = ({videos, auth}) => {
  const { loading, request } = useHttp()
  const auth_user = useContext(AuthContext)

  let path = ""
  if (auth) {
    path = "admin_"
  }
	if (!videos.length) {
		return <p className="center">No videos</p>
	}

  const deleteHandler = async (passed) => {
      console.log(passed)
      try {
        const data = request( `/api/gallery/remove/${passed}`, 'GET', null, {'Authorization': `Bearer ${auth_user.token}`})
        console.log('removed ', data)
        window.location.reload(false)

      } catch(e) {}
      
    }
  

	return (
		  <table>
        <thead>
          <tr>
              <th>video - link</th>
              <th> video caption</th>
              <th>video date</th>
              <th>video category</th>
              {auth && <th>video action</th>}
          </tr>
        </thead>
        <tbody>
        	{ videos.map( video => {
        		return (
					<tr key={video._id}>
			            <td>
                    <Link to={`/${path}gallery/${video._id}`}>Visit Page</Link> 
                  </td>
			            <td>{video.caption}</td>
			            <td><strong>{new Date(video.date).toLocaleDateString()}</strong></td>
                  <td>{video.category}</td>
                  {auth && 
                    <td>
                      <Link to={{
                        pathname: `/admin_edit_gallery/${video._id}`,
                        state: { url: video.url, caption: video.caption, category: video.category }
                      }} className="btn-floating btn-large waves-effect waves-light blue"> <i className="material-icons">edit</i></Link>
                      <button onClick={() => deleteHandler(video._id)} disabled={loading} className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">delete</i></button>
                    </td>
                  }
			         </tr>
        		)
        	} ) }          
        </tbody>
      </table>
	)
}