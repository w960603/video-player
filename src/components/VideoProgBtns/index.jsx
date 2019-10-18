import React, {Component} from 'react';

class VideoProgBtns extends Component {
  state={
    stopBtnSrc: require('@/icons/stop.svg'),
    playBtnSrc: require('@/icons/1.svg'),
  }
  handleChangeProgress = (time) => {
    console.log('能点');
    this.props.video.currentTime = this.props.video.currentTime + time
  }
  handlePauseVideo = () => {
    this.props.video.paused ?
      this.props.video.play() :
      this.props.video.pause()
  }
  render() {
    const {stopBtnSrc, playBtnSrc} = this.state
    return (
      <div className="progress-btns">
          <span onClick={this.handleChangeProgress.bind(this, -15)}>
            <img className={'time-btn'} src={require('@/icons/houtuis.svg')} alt="后退15s"/>
          </span>
        <span onClick={this.handlePauseVideo}>
            <img className={'play-btn'} src={
              this.props.video && !this.props.video.paused ? stopBtnSrc : playBtnSrc
            } alt=""/>
          </span>
        <span onClick={this.handleChangeProgress.bind(this, 15)}>
            <img className={'time-btn'} src={require('@/icons/qianjins.svg')} alt="前进15s"/>
          </span>
      </div>
    );
  }
}

export default VideoProgBtns;
