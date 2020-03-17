import React from 'react'
import {Link} from 'react-router-dom'

export const VideosList = ({videos}) => {

	if (!videos.length) {
		return <p className="center">No videos</p>
	}

	return (
		  <table>
        <thead>
          <tr>
              <th>video - link</th>
              <th> video caption</th>
              <th>video date</th>
          </tr>
        </thead>
        <tbody>
        	{ videos.map( video => {
        		return (
					<tr key={video._id}>
			            <td><Link to={`/admin_gallery/${video._id}`}>Visit Page</Link></td>
			            <td>{video.caption}</td>
			            <td><strong>{new Date(video.date).toLocaleDateString()}</strong></td>
			         </tr>
        		)
        	} ) }          
        </tbody>
      </table>
	)
}