import React from 'react';
import Track from './Track.jsx'

const SongList = (props) => {
  return (
    <div>
      {props.album.map((song,index) => {
        return (
        <Track song = {song} index = {index} album ={props.album} key={index} changeTrack = {props.changeTrack}></Track>
        )
      })}
    </div>
  )
}

export default SongList;
