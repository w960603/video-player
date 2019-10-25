import React, {Component} from 'react';
import Slider from '../Slider'

class Voice extends Component {
  static defaultProps = {
    volume:0,
    min:0,
    max:1,
    step:0.01,
    isMuted:false,
    handleMute:()=>{}
  }
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
            ?<img src={this.state.mutedSrc} alt="取消静音" title={'取消静音'}/>
              :<img src={this.state.unmutedSrc} title={'静音'} alt="静音"/>
          }
        </div>
        <Slider {...this.props} />
      </div>
    );
  }
}

export default Voice;
