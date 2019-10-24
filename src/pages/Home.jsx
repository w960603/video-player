import React, {Component} from 'react';
import VideoControllers from '../components/VideoControllers/'
import VideoHistory from '../components/VideoHistory'
import Slider from '../components/Slider'
import FileSelect from '../components/FileSelect'
import {timeFormat, throttle} from '../utils'
// import VideoFullScreen from "../components/VideoFullScreen";

class Home extends Component {
  state = {
    showControl: false,
    videoSrc: '',
    canPlay: false,
    isFullScreen: false,
    stopBtnSrc: require('@/icons/stop.svg'),
    playBtnSrc: require('@/icons/1.svg'),
    newVideoSrc: require('@/icons/new_video.svg'),

    duration: 0,
    currentTime: 0,

    videoList: [],
  }
// 文件改变
  onFileChange = (e) => {
    const {videoList} = this.state
    const File = e.currentTarget.files[0]
    const rowUrl = e.currentTarget.value

    let isNew = true
    if (!File) return
    const videoSrc = URL.createObjectURL(File)
    /*视频播放历史*/
    const fileInfo = {
      rowUrl: rowUrl,
      size: File.size,
      fileName: File.name,
      url: videoSrc,
      lastModified: File.lastModified,
      timestamp: +new Date()
    }
    videoList.forEach(item => {
      // 判断是否已经存在
      if (item.rowUrl === fileInfo.rowUrl && item.size === fileInfo.size) {
        // 更新url 防止视频内容改变
        item.lastModified = fileInfo.lastModified
        item.url = fileInfo.url
        item.timestamp = +new Date()
        isNew = false
      }
    })
    if (isNew) {
      videoList.push(fileInfo)
    }
    /**************/
    this.setState({
      videoSrc: videoSrc,
      videoList
    })
    e.currentTarget.value = null
  }
  handleVideoChange = (item) => {

    this.setState({
      videoSrc: item.url
    })
  }

  handleMouseLeave = e => {
    // e.persist()
    const relatedTarget = e.relatedTarget
    if (!!relatedTarget && relatedTarget !== window) {
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
    const {video} = this
    /*获取播放列表缓存*/
    const videoListStr = localStorage.getItem('videoList')
    const videoList = videoListStr ? JSON.parse(videoListStr) : []
    this.setState({
      videoList
    })
    // 视频可以播放
    video.oncanplay = (e) => {
      this.handleReplay()
      this.setState({
        canPlay: true,
        duration: this.video.duration
      })
      // 获取视频原始宽高
      console.log(video.videoHeight);
    }
    // 视频播放出错
    video.onerror = e => {
      console.log('视频错误:', this.video.error);
    }
    // 视频播放进度改变
    video.ontimeupdate = this.handleVideoPlay


    // 监听方向键, 更改视频播放进度及音量
    this.listenKeyEvent()

    this.isMobile()

  }

  //判断是否为手机端
  isMobile() {
    const ua = navigator.userAgent;
    const ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      isAndroid = ua.match(/(Android)\s+([\d.]+)/),
      isMobile = isIphone || isAndroid;
    this.setState({
      isMobile
    })
  }

  handleFullScreen = () => {
    const {isFullScreen} = this.state
    if (isFullScreen) {
      this.exitFullScreen()
    } else {
      this.requestFullScreen()
    }
  }
  // 全屏
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
  // 取消全屏
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
  // 监听退出全屏
  listenEsc = () => {
    const isFull = document.fullscreen || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
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


  render() {
    const {videoSrc} = this.state
    return (

      <div className={'home'}>
        <div className={'file-select-mask'} style={{right1: this.state.showControl ? '0' : '-40px'}}>

        {/*选择视频*/}
        <FileSelect onChange={e => this.onFileChange(e)}>选择视频</FileSelect>
      </div>
        <div className={`homeLeft`} style={{display: videoSrc ? 'block' : 'block'}}>
          {
            !videoSrc && (
              <div className="mask">
                <div className={'tips'}>您还没有可以播放的视频</div>
                <FileSelect showBtn onChange={e => this.onFileChange(e)}>选择视频</FileSelect>
              </div>)
          }
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
                您的浏览器不支持该播放视频
              </video>
            </div>

            {/*打开新视频*/}
            <div className={'file-select-mask'} style={{right1: this.state.showControl ? '0' : '-40px'}}>

              {/*选择视频*/}
              <FileSelect onChange={e => this.onFileChange(e)}>
                <img className={'img32'} src={this.state.newVideoSrc}/>
              </FileSelect>
            </div>
            <div className={'controls'} ref={controls => this.controls = controls}
                 style={{bottom: this.state.showControl ? '0' : '-72px'}}>


              {/*进度条*/}
              <div className="progress-line">
                <Slider ref={progress => this.progress = progress} value={this.state.currentTime} min={0}
                        max={this.state.duration}
                        onChange={this.handleProgressChange} onDragEnd={this.handleReplay}/>

                <div className="time">
                  <span>
                    {timeFormat(this.state.currentTime)}
                  </span>
                      /
                  <span>
                    {timeFormat(this.state.duration)}
                  </span>
                </div>
              </div>

              {/*底部控制栏*/}
              <VideoControllers
                isFullScreen={this.state.isFullScreen}
                video={this.video}
                handleFullScreen={this.handleFullScreen}/>
            </div>
          </div>
        </div>
        {this.state.videoList.length > 0 &&
        <div className="homeRight">
          {/*播放历史*/}

          <VideoHistory onClick={this.handleVideoChange} onFileChange={this.onFileChange} videoList={this.state.videoList}/>

        </div>}
      </div>
    );
  }
}

export default Home;
