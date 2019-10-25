import React from 'react';

function VideoFullScreen(props, context) {
  const {isFullScreen} = props
  return (
    <div className={'full-screen-wrapper'}>
      <div className={'full-screen'} onClick={props.onClick}>
        {
          isFullScreen ? (
              <img src={require('@/icons/quxiaoquanping.svg')} title={'取消全屏'} alt="取消全屏"/>
            ) :
            (
              <img src={require('@/icons/quanping.svg')} title={'全屏'} alt="全屏"/>
            )
        }
      </div>
    </div>
  );
}

export default VideoFullScreen;
