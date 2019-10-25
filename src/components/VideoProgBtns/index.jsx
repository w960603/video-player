import React, {Component} from 'react';

class VideoProgBtns extends Component {
  state = {
    stopBtnSrc: require('@/icons/stop.svg'),
    playBtnSrc: require('@/icons/1.svg'),
  }
  handleChangeProgress = (time) => {
    const {video} = this.props
    // 视频有错误时无法使用
    if (!video.error) {
      this.props.video.currentTime = this.props.video.currentTime + time
    }
  }
  handlePauseVideo = () => {
    const {video} = this.props
    // 视频有错误时无法使用
    if (!video.error) {
      video.paused ?
        video.play() :
        video.pause()
    }
  }

  render() {
    const {stopBtnSrc, playBtnSrc} = this.state
    const {video} = this.props
    return (
      <div className="progress-btns">
          <span onClick={this.handleChangeProgress.bind(this, -15)}>
            <img className={'time-btn'} src={require('@/icons/houtuis.svg')} title={'后退15s'} alt="后退15s"/>
          </span>
        <span onClick={this.handlePauseVideo}>
            <img className={'play-btn'} src={
              video && !video.paused ? stopBtnSrc : playBtnSrc
            } title={video && !video.paused ? '暂停' : '播放'}/>
          </span>
        <span onClick={this.handleChangeProgress.bind(this, 15)}>
            <img className={'time-btn'} src={require('@/icons/qianjins.svg')} title={'前进15s'} alt="前进15s"/>
          </span>
      </div>
    );
  }
}

export default VideoProgBtns;
