import React from 'react';
import $ from 'jquery';
import SongList from './SongList.jsx'
import styled from 'styled-components';


class Music extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    currentTrack: "",
    play: false,
    pause: true,
    album:[],
    artist: "",
    audio: new Audio(""),
    url: "",
    time: "0:00",
    intervalId: null,
    album_title:"",
    sliderValue: 0,
    description:""
  }

  this.playTrack = this.playTrack.bind(this)
  this.get = this.get.bind(this)
  this.changeTrack = this.changeTrack.bind(this)
  this.volumeDown = this.volumeDown.bind(this)
  this.volumeUp = this.volumeUp.bind(this)
  this.currentTrackTime =this.currentTrackTime.bind(this)
  this.handleSlider = this.handleSlider.bind(this)
}
componentDidMount(){
  this.get(window.location.pathname);
  var intervalId = setInterval(this.currentTrackTime, 10);
  this.setState({intervalId: intervalId});
}
componentWillUnmount() {
  // use intervalId from the state to clear the interval
  clearInterval(this.state.intervalId);
}
currentTrackTime(){
  var songTime =(parseInt(((this.state.audio.currentTime/60)-(parseInt(this.state.audio.currentTime/60)))*60));
  var seconds = songTime < 10? "0"+ songTime: songTime

  this.setState({
    time: (parseInt(this.state.audio.currentTime/60))+":"+ seconds,
    sliderValue: this.state.audio.currentTime
  })
}

playTrack(){
  if (this.state.play === false) {
    this.setState({ play: true, pause: false })
    this.state.audio.play();
  } else {
    this.setState({ play: false, pause: true })
    this.state.audio.pause();
  }
}

volumeDown(){
    this.state.audio.volume -= .1
  }
volumeUp(){
    this.state.audio.volume += .1
  }

get(albumId){

  if(albumId.length === 1) {
    albumId = '/1';
  }

  $.get(`/media${albumId}`, (data) => {
    console.log(data)
    this.setState({
      artist:data.artist,
      album: data.tracks,
      album_title: data.album_title,
      currentTrack: data.tracks[0].track,
      audio: new Audio(data.tracks[0].url),
      url:data.tracks[0].url,
      time: this.state.audio.currentTime,
      description: data.artist_description
    })
  })
}
handleSlider(e){
  this.state.audio.currentTime = e.target.value;
  // this.setState({
  //     sliderValue: this.state.audio.currentTime
  //   });

}

changeTrack(e){
  if (this.state.album[e.target.id].track !== this.state.currentTrack) {
    this.state.audio.pause();
    this.setState({
      play: false,
      pause: true,
      currentTrack: this.state.album[e.target.id].track,
      audio: new Audio(this.state.album[e.target.id].url),
      url:this.state.album[e.target.id].url
    })
  }

}


render() {

  const duration = (parseInt(((this.state.audio.duration/60)-(parseInt(this.state.audio.duration/60)))*60));
  const seconds = duration < 10? "0" + duration : duration;
  let songDuration = (parseInt(this.state.audio.duration/60))+":"+ seconds;

  return (
    <Wrapper>
      <br></br>
      <Title>{this.state.album_title}<br></br>
        <div style = {{fontSize: "15px"}}>By <Links>{this.state.artist}</Links></div>
      </Title>
      <MediaContainer>
        <SongTitle> {this.state.currentTrack}&nbsp;&nbsp;&nbsp;&nbsp;{this.state.time}/{songDuration}</SongTitle>
        <PlayButton><PlaySymbol onClick={this.playTrack} playing = {this.state.play}></PlaySymbol></PlayButton>
            <Slider type="range" min="0" max={this.state.audio.duration || 0} value = {this.state.sliderValue || 0} step = "1" onChange = {this.handleSlider}/>
        <VolDown onClick={this.volumeDown}> </VolDown>
        <VolUp onClick={this.volumeUp}></VolUp><br></br>
      </MediaContainer>
      <Descp>Support the band! Buy the album <Links>here</Links></Descp>
      <SongList album = {this.state.album} changeTrack = {this.changeTrack}/>

      <Descp>Additional Info: <br></br><br></br> {this.state.description}</Descp>
    </Wrapper>
    );
  }
}

const Descp = styled.div`
  margin: 10px;
  font-size: 15px
`

var Slider = styled.input`
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 3;
  grid-row-end: 3;
  justify-self: center;
  -webkit-appearance: none;
  width: 230px;
  background: grey;
  outline: none;
  height: 5px;
  margin: auto;

  &::-webkit-slider-thumb{
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 10px;
  background: white;
  cursor: pointer;
  }
`
const MediaContainer = styled.div`
  display: inline-grid;
  grid-template-columns: 50px 250px 25px 25px;
  grid-template-rows: 10px 10px 20px;
  margin: 10px;
  margin-bottom: 20px;
`
const SongTitle =styled.div`
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  text-align: center;
  font-size: 11px;
`
const Wrapper = styled.section`
  background: #3858AD;
  color: #F8EAEB;
  width: 400px;
  height: auto;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
`
const Links = styled.a`
  color: #6591E2;
  cursor: pointer;
  :hover {
    color: #E9D3B3;
  }
`

const VolDown = styled.button`
  grid-column-start: 3;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 3;
  background-image: url("https://cdn2.iconfinder.com/data/icons/media-controls-5/100/vol_down-512.png");
  background-size: 15px;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
  width: 20px;
  height: 20px;
  content:"";
  line-height: 0;
  padding: 0;
`;

const VolUp = styled.button`
  grid-column-start: 4;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 3;
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg");
  background-size: 13px;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 3px;
  display: inline-block;
  width: 20px;
  height: 20px;
  content:"";
  line-height: 0;
  padding: 0;

`;

const PlayButton = styled.button`
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1
  grid-row-end: 1
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  cursor: pointer;
  height: 50px;
  width: 50px;
  padding: 0;
  line-height: 0;
`
const PlaySymbol = styled.div`
  background-image: url(${props => !props.playing? "https://ya-webdesign.com/images/png-video-play-button-9.png" : "http://www.newdesignfile.com/postpic/2015/10/pause-button-icon_248724.png"});
  background-size: ${props => !props.playing? "40px": " 30px 30px"};
  background-position: center;
  display: inline-block;
  width: ${props => !props.playing? "40px": "30px"};
  height: ${props => !props.playing? "40px": "30px"};
  content:"";
`

const Title = styled.h1`
  font: normal 2em 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 15px 10px 10px 10px;
`

export default Music;

