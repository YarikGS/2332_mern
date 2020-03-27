import React, {setState} from 'react'
import {Link} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'

export const SliderList = ({slider, auth}) => {
  const { loading, request } = useHttp()

  let path = ""
  if (auth) {
    path = "admin_"
  }
	if (!slider.length) {
		return <p className="center">No slider</p>
	}


  const deleteHandler = async (passed) => {
    console.log(passed)
    try {
      const data = request( `/api/slider/remove/${passed}`, 'GET', null)
      window.location.reload(false)

    } catch(e) {}
    
  }

	return (
		  <table>
        <thead>
          <tr>
              <th>slider - img</th>
              <th> slider caption</th>
              <th>slider date</th>
              {auth && <th>slider action</th>}
          </tr>
        </thead>
        <tbody>
        	{ slider.map( slider => {
        		return (
					<tr key={slider._id}>
			            <td>
                    <img src={slider.image} alt="image" style={{width: '150px'}}  />
                  </td>
			            <td>{slider.caption}</td>
			            <td><strong>{new Date(slider.date).toLocaleDateString()}</strong></td>
                  {auth && 
                    <td>
                      <Link to={{
                        pathname: `/admin_edit_slider/${slider._id}`,
                        state: { imageId: slider.imageId, image: slider.image, caption: slider.caption }
                      }} className="btn-floating btn-large waves-effect waves-light blue"> <i className="material-icons">edit</i></Link>
                      <button onClick={() => deleteHandler(slider._id+'/'+slider.imageId)} disabled={loading} className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">delete</i></button>
                    </td>
                  }
			         </tr>
        		)
        	} ) }          
        </tbody>
      </table>
	)
}