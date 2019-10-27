import React, { Component } from 'react';
import FileSelect from '../FileSelect'

class Index extends Component {
  static defaultProps = {
    onFileChange:()=>{}
  }
  state={
    newVideoSrc: require('@/icons/new_video.svg'),
  }

  render() {
    return (
      <div className={'video-history'}>
        <div className={'title'}>
          <span>
            播放历史
          </span>
          {/*打开新视频*/}
          <div className={'file-select-mask'}>

            {/*选择视频*/}
            <FileSelect onChange={e => this.props.onFileChange(e)}>
              <img className={'img32'} alt={'打开视频'} title={'打开视频'} src={this.state.newVideoSrc} />
            </FileSelect>
          </div>
        </div>
        {
          this.props.videoList.map(item => {
            return <div className={'history-item'} key={item.timestamp} onClick={() => this.props.onClick(item)}>{item.fileName}</div>
          })
        }
      </div>
    );
  }
}

export default Index;
