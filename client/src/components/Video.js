import React from 'react'
import Iframe from 'react-iframe'
export const VideoFrame = ({ video }) => {
	const videoSegment = String( video.url.substring(video.url.lastIndexOf('/') + 1) )
	const fullUrl = `https://player.vimeo.com/video/${videoSegment}?color=b0ddd9&title=0&byline=0&portrait=0&badge=0`
	// console.log(fullUrl)
	
	return (
    <>
      <h2>{video.caption} {video.url} {videoSegment}</h2>
		<Iframe src={fullUrl}
        width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowFullScreen
        id="myId"
        className="myClassname"
        display="initial"
        position="relative" />
      <p>Created: <strong>{new Date(video.date).toLocaleDateString()}</strong></p>
    </>
  )
}