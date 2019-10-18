import React from 'react';

function VideoFullScreen(props,context) {
  return (
    <div className={'full-screen-wrapper'}>
    <div className={'full-screen'} onClick={props.onClick}>
      <img src={require('@/icons/quanping.svg')} alt="全屏"/>
      <img src={require('@/icons/quxiaoquanping.svg')} alt="取消全屏"/>
    </div>
    </div>
  );
}

export default VideoFullScreen;
