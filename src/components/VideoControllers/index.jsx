import React, {Component} from 'react';
import VideoProgBtns from '../VideoProgBtns'
import Voice from '../Voice'
import VideoFullScreen from '../VideoFullScreen'

class VideoControllers extends Component {
  static defaultProps = {
    video: {},
    volume: 1
  }

  handleMute = () => {
    const mute = !this.props.video.muted
    this.props.video.muted = mute

  }
  handleVoiceChange = val => {
    this.props.video.volume = val
  }
  handleFullScreen = ()=>{
    const {handleFullScreen} = this.props
    handleFullScreen&&handleFullScreen()
  }

  render() {
    return (
      <div className="video-controllers">
        <Voice value={this.props.volume} min={0} max={1} step={0.01} onChange={this.handleVoiceChange}
               handleMute={this.handleMute} isMuted={!this.props.volume}/>
        <VideoProgBtns video={this.props.video}/>


        <VideoFullScreen onClick={this.handleFullScreen}/>

      </div>
    );
  }
}

export default VideoControllers;

