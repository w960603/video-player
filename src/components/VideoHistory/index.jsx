import React, {Component} from 'react';

class Index extends Component {

  render() {
    return (
      <div className={'video-history'}>
        <div className={'title'}>
          播放历史
        </div>
        {
          this.props.videoList.map(item=>{
            return <div className={'history-item'} key={item.timestamp} onClick={()=>this.props.onClick(item)}>{item.fileName}</div>
          })
        }
      </div>
    );
  }
}

export default Index;
