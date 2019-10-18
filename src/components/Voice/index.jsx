import React, {Component} from 'react';
import Slider from '../Slider'

class Voice extends Component {
  state={
    mutedSrc:require('@/icons/mute.svg'),
    unmutedSrc:require('@/icons/yinliang.svg')
  }
  render() {
    return (
      <div  className="voice-wrapper">
        <div className={'mute-icon'} onClick={this.props.handleMute}>
          {
            this.props.isMuted
            ?<img src={this.state.mutedSrc} alt=""/>
              :<img src={this.state.unmutedSrc} alt="静音"/>
          }
        </div>
        <Slider {...this.props}/>
      </div>
    );
  }
}

export default Voice;
