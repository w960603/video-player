import React, {Component} from 'react';
import VideoProgBtns from '../VideoProgBtns'
import Voice from '../Voice'
import VideoFullScreen from '../VideoFullScreen'

class VideoControllers extends Component {
  static defaultProps = {
    video: {},
    volume: 1,
    isFullScreen: false,
    handleFullScreen: () => {
    },
    onFileChange: () => {
    }
  }
  state = {
    prevVolume: 1
  }

  handleMute = () => {
    const {video} = this.props
    let {prevVolume} = this.state
    const volume = video.volume
    if (volume === 0) { // 如果是静音状态, 就取消静音
      if (prevVolume === 0) prevVolume = 1  // 如果是手动调到静音的, 那么取消静音后, 音量调到1
      this.setState({prevVolume: 1})
      video.volume = prevVolume
    } else {// 如果不是静音状态, 就静音
      video.volume = 0;
      this.setState({prevVolume})
    }
    video.volume = volume === 0 ? prevVolume : 0

  }
  handleVoiceChange = val => {
    this.props.video.volume = val
    this.setState({
      prevVolume: val
    })
  }
  handleFullScreen = () => {
    const {handleFullScreen} = this.props
    handleFullScreen && handleFullScreen()
  }

  //视频音量
  volume = () => {
    const {video} = this.props
    if (!video || video.muted) {
      return 0
    } else {
      return video.volume
    }
  }

  render() {
    return (
      <div className="video-controllers">
        <Voice value={this.volume()} min={0} max={1} step={0.01} onChange={this.handleVoiceChange}
               handleMute={this.handleMute} isMuted={!this.volume()}/>
        <VideoProgBtns video={this.props.video}/>

        <VideoFullScreen isFullScreen={this.props.isFullScreen} onClick={this.handleFullScreen}/>
      </div>
    );
  }
}

export default VideoControllers;

