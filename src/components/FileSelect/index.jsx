import React, {Component} from 'react';

class Index extends Component {

  handleSelectFile = () => {
    if (!this.props.disabled) {
      this.file.click()
    }
  }

  render() {
    return (

      <div className={'file-select'} onClick={this.handleSelectFile}>
        <input id={'file-select-input'} ref={file => this.file = file} hidden={true} type="file" accept={'.mp4'}
               onChange={e => this.props.onChange(e)}/>
        <button className={'file-select-btn'} {...this.props}>
          选择视频
        </button>
      </div>
    );
  }
}

export default Index;
