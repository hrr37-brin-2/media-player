import React from 'react';
import ReactDOM from 'react-dom';
import Music from './components/Music.jsx'

window.Music = Music;

ReactDOM.render(<Music />,document.getElementById('mediaplayer'));
