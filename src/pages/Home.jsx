import React, {Component} from 'react';
// import Video from '@/components/Video'
import FileSelect from '../components/FileSelect'
import VideoControllers from '../components/VideoControllers/'
import VideoHistory from '../components/VideoHistory'
import Slider from '../components/Slider'
import {timeFormat, throttle} from '../utils'

class Home extends Component {
  state = {
    showControl: false,
    videoSrc: '',
    canPlay: false,
    isFullScreen: false,
    stopBtnSrc: require('@/icons/stop.svg'),
    playBtnSrc: require('@/icons/1.svg'),

    duration: 0,
    currentTime: 0,

    videoList: [],
  }
  videoStyle = {
    // width: '100%'
  }

  onFileChange = (e) => {

    const {videoList} = this.state
    const File = e.currentTarget.files[0]
    const value = e.currentTarget.value
    const fileName = value.match(/(.+\\)+(.+)$/)[2]
    let isNew = true

    if (!File) return
    const videoSrc = URL.createObjectURL(File)
    const fileInfo = {
      fileName,
      url: videoSrc,
      timestamp: +new Date()
    }
    videoList.forEach(item => {
      if (item.fileName === fileName) {
        isNew = false
      }
    })
    if (isNew) {
      videoList.push(fileInfo)
    }

    this.setState({
      videoSrc: videoSrc,
      videoList
    })
    e.currentTarget.value = null
  }
  handleVideoChange = (src) => {
    console.log('handleVideoChange');
    this.setState({
      videoSrc: src
    })
  }

  handleMouseLeave = e => {
    // e.persist()
    const relatedTarget = e.relatedTarget
    if (!!relatedTarget && relatedTarget !== window) {
      console.log(relatedTarget !== window);
      this.handleHiddenControl(e)
    }
  }
  handleHiddenControl = (e) => {
    this.timer = setTimeout(() => {
      this.setState({
        showControl: false
      })
    }, 2000)
  }

  handleShowControl = throttle((e) => {
    const target = e.target
    if (!this.state.showControl) {
      this.setState({
        showControl: true
      })
    }
    this.clearTimer()
    if (target === this.video) {
      this.handleHiddenControl()
    }
  })

  clearTimer = () => {
    clearTimeout(this.timer)
  }

  // 视频播放进度改变时执行
  handleVideoPlay = e => {
    const currentTime = this.video.currentTime
    this.setState({
      currentTime: currentTime,
    })
  }
  // 设置进度调节按钮

  handleProgressChange = val => {
    this.video.pause()
    this.video.currentTime = val
  }


  handleReplay = () => {
    setTimeout(() => {
      if (this.video.paused && !this.progress.state.dragging) {//如果视频没有播放, 改变完currentTime后就播放
        this.video.play()
      }
    }, 200)

  }

  componentDidMount() {
    /*获取播放列表缓存*/
    const videoListStr = localStorage.getItem('videoList')
    const videoList = videoListStr ? JSON.parse(videoListStr) : []
    this.setState({
      videoList
    })
    // 视频可以播放
    this.video.oncanplay = (e) => {
      this.handleReplay()
      this.setState({
        canPlay: true,
        duration: this.video.duration
      })
    }
    // 视频播放出错
    this.video.onerror = e => {
      console.log(this.video.error);
    }
    // 视频播放进度改变
    this.video.ontimeupdate = this.handleVideoPlay

    const {videoContainer} = this
    videoContainer.addEventListener("keydown", () => {
      console.log(1);
    });

    this.listenKeyEvent()
  }

  handleFullScreen = () => {
    console.log(this.videoContainer);
    const {isFullScreen} = this.state
    if (isFullScreen) {
      this.exitFullScreen()
    } else {
      this.requestFullScreen()
    }
    // this.videoContainer.requestFullscreen();
  }
  requestFullScreen = () => {
    const {videoContainer} = this   // 该元素必须设置宽高100%, 否则在360等浏览器全屏时不会自动铺满

    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen()
    } else if (videoContainer.mozRequestFullScreen) {
      videoContainer.mozRequestFullScreen()
    } else if (videoContainer.webkitRequestFullScreen) {
      videoContainer.webkitRequestFullScreen()
    }
    this.setState({
      isFullScreen: true
    })

    // 监听全屏事件
    videoContainer.addEventListener("fullscreenchange", this.listenEsc);
    videoContainer.addEventListener("mozfullscreenchange", this.listenEsc);
    videoContainer.addEventListener("webkitfullscreenchange", this.listenEsc);
    videoContainer.addEventListener("msfullscreenchange", this.listenEsc);
  }
  exitFullScreen = () => {
    const {videoContainer} = this

    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    }
    this.setState({
      isFullScreen: false
    })

    videoContainer.removeEventListener("fullscreenchange", this.listenEsc);
    videoContainer.removeEventListener("mozfullscreenchange", this.listenEsc);
    videoContainer.removeEventListener("webkitfullscreenchange", this.listenEsc);
    videoContainer.removeEventListener("msfullscreenchange", this.listenEsc);
  }
  listenEsc = e => {
    const isFull = document.fullscreen || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
    console.log(isFull);
    if (!isFull) {
      this.setState({
        isFullScreen: false
      })
    }
  }

  listenKeyEvent = () => {
    window.addEventListener('keydown', this.handleKeyEvent)
  }
  handleKeyEvent = e => {
    const code = e.keyCode
    const {video} = this
    const {volume} = video

    switch (code) {
      case 37:// 左方向键, 回放5s
        video.currentTime = video.currentTime - 5;
        break;
      case 39: // 右方向键, 快进5s
        video.currentTime = video.currentTime + 5
        break;
      case 38: // 上方向键, 音量增加0.1
        video.volume = volume <= 0.9 ? (volume + 0.1).toFixed(1) : 1
        break;
      case 40: // 下方向键, 音量减小0.1
        video.volume = volume >= 0.1 ? (volume - 0.1).toFixed(1) : 0
        break
      default :
        break
    }
  }

  /*computed Methods*/

  //视频音量
  volume = () => {
    const {video = {}} = this
    console.log(video.volume);
    if (!video || video.muted) {
      return 0
    } else {
      return video.volume
    }
  }

  render() {
    const {videoSrc} = this.state
    return (
      <div className={'home'}>

        <div className={`homeLeft w-col-lg-4 w-col-md-12`} style={{display: videoSrc ? 'block' : 'none'}}>
          <div className={'player-wrapper'} ref={videoContainer => this.videoContainer = videoContainer}
               onFocus={() => {
                 console.log('focus');
               }}
               onMouseLeave={this.handleMouseLeave}
               onMouseMove={this.handleShowControl}
          >
            <div ref={videoPlayer => this.videoPlayer = videoPlayer}>
              <video className={'video'} src={this.state.videoSrc} ref={video => this.video = video}
                     style={this.videoStyle}
                     autoPlay={true}>
                {/*<source  src={this.state.videoSrc} type={"video/mp4"}/>*/}
                {/*<source  src={this.state.videoSrc} type={"video/ogg"}/>*/}
                {/*<source  src={this.state.videoSrc} type={"video/webM"}/>*/}
                您的瀏覽器不支持該播放視頻
              </video>
            </div>
            <div className={'controls'} ref={controls => this.controls = controls}
                 style={{bottom: this.state.showControl ? '0' : '-80px'}}>
              <div className="progress-line">
                <Slider ref={progress => this.progress = progress} value={this.state.currentTime} min={0}
                        max={this.state.duration}
                        onChange={this.handleProgressChange} onDragEnd={this.handleReplay}/>

                <div className="time">
              <span>
                {
                  timeFormat(this.state.currentTime)
                }
              </span>
                  /
                  <span>
                {
                  timeFormat(this.state.duration)
                }
              </span>
                </div>
              </div>
              <VideoControllers handleFullScreen={this.handleFullScreen} volume={this.volume()} video={this.video}/>
            </div>
          </div>
        </div>
        <div className="homeRight  w-col-lg-3 w-col-md-6">
          {/*选择视频*/}
          <FileSelect onChange={e => this.onFileChange(e)}/>

          {/*播放历史*/}
          <VideoHistory onClick={this.handleVideoChange} videoList={this.state.videoList}/>
        </div>
      </div>
    );
  }
}

export default Home;
