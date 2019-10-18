import React from 'react';
import {timeFormat} from '@/utils'

function Index(props) {
  return (
    <div className="progress-line">
      <div className="progress-bar">
        {/*总长度*/}
        <div className="progress-total line"/>
        {/*以缓冲*/}
        <div className="progress-buffer line"
             style={{width: props.currentTime / props.duration * 100 + '%'}}/>
        {/*控制进度按钮*/}
        <div className="progress-btn"
             style={props.progressBtnStyle}>
          <div className="inner"/>
        </div>
      </div>
      {/*视频时间*/}
      <div className="time">
              <span>
                {
                  timeFormat(props.currentTime)
                }
              </span>
        /
        <span>
                {
                  timeFormat(props.duration)
                }
              </span>
      </div>
    </div>
  );
}

export default Index;
