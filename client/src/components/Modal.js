import React, { Component, useState, useEffect } from "react";
import {useMessage} from '../hooks/message.hook'
import {useHttp} from '../hooks/http.hook'
import {useHistory} from 'react-router-dom'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

export const Modal = () => {

     const history = useHistory()
  const message = useMessage()
  const {loading, error, request, clearError} = useHttp()
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')

  useEffect( () => {
    message(error)
    clearError()
  }, [error, message, clearError] )

  useEffect( () => {
    window.M.updateTextFields()
  }, [] )

  const createHandler = async () => {
    try {
      const data = await request( '/api/gallery/add', 'POST', {url, caption})
      console.log(data)
      history.push(`/admin_gallery/${data.gallery._id}`)
    } catch(e) {}

  }
  
    useEffect( () => {  
      const options = {
        onOpenStart: () => {
          console.log("Open Start");
        },
        onOpenEnd: () => {
          console.log("Open End");
        },
        onCloseStart: () => {
          console.log("Close Start");
        },
        onCloseEnd: () => {
          console.log("Close End");
        },
        inDuration: 250,
        outDuration: 250,
        opacity: 0.5,
        dismissible: false,
        startingTop: "4%",
        endingTop: "10%"
      };
      M.Modal.init(this.Modal, options);
    }, [Modal])

    // let instance = M.Modal.getInstance(this.Modal);
    // instance.open();
    // instance.close();
    // instance.destroy();
  

    return (
      <div>
        <a
          className="waves-effect waves-light btn modal-trigger"
          data-target="modal1"
        >
          add item
        </a>

        <div
          ref={Modal => {
            this.Modal = Modal;
          }}
          id="modal1"
          className="modal"
        >
          {/* If you want Bottom Sheet Modal then add 
                        bottom-sheet class to the "modal" div
                        If you want Fixed Footer Modal then add
                        modal-fixed-footer to the "modal" div*/}
          <div className="modal-content">
            <h4>Add Video item</h4>
              <div className="card blue darken-1">
                <div className="card-content white-text">
                  <span className="card-title">Add new Vimeo Video</span>
                  <div className="row">
                    <div className="input-field">
                      <input onChange={e => setUrl(e.target.value)} id="url" type="text" name="url" />
                      <label htmlFor="url">Vimeo url</label>
                    </div>
                    <div className="input-field">
                      <input onChange={e => setCaption(e.target.value)} id="caption" type="text" name="text" />
                      <label htmlFor="caption">Caption</label>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div className="modal-footer">
            <button onClick={createHandler} disabled={loading} className="btn green darken-2" style={{ marginRight: 10 }}>Add Video</button>
            <a className="modal-close waves-effect waves-red btn-flat">close</a>
          </div>
        </div>
      </div>
    )
  }