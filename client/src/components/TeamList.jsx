import React from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'

export const TeamList = ({team, auth}) => {
  const { loading, request } = useHttp()

  let path = ""
  if (auth) {
    path = "admin_"
  }
	if (!team.length) {
		return <p className="center">No team members</p>
	}


  const deleteHandler = async (passed) => {
    console.log(passed)
    try {
      request( `/api/team/remove/${passed}`, 'GET', null)
      window.location.reload(false)

    } catch(e) {}
    
  }

	return (
		  <table>
        <thead>
          <tr>
              <th>team - img</th>
              <th> team caption</th>
              <th> team text</th>
              <th>team date</th>
              {auth && <th>team action</th>}
          </tr>
        </thead>
        <tbody>
        	{ team.map( team => {
        		return (
					<tr key={team._id}>
			            <td>
                    <img src={`/uploads/team/${team.image}`} alt="image" style={{width: '150px'}}  />
                  </td>
			            <td>{team.caption}</td>
                  <td>{team.text}</td>
			            <td><strong>{new Date(team.date).toLocaleDateString()}</strong></td>
                  {auth && 
                    <td>
                      <Link to={{
                        pathname: `/admin_edit_team/${team._id}`,
                        state: { image: team.image, caption: team.caption, text: team.text }
                      }} className="btn-floating btn-large waves-effect waves-light blue"> <i className="material-icons">edit</i></Link>
                      <button onClick={() => deleteHandler(team._id+'/'+team.image)} disabled={loading} className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">delete</i></button>
                    </td>
                  }
			         </tr>
        		)
        	} ) }          
        </tbody>
      </table>
	)
}