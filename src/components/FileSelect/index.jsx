import React, {Component} from 'react';

class Index extends Component {
static defaultProps={
  onChange:()=>{},
  className:()=>{},
  showBtn:false,
}
  handleSelectFile = () => {
    if (!this.props.disabled) {
      this.file.click()
    }
  }

  render() {
    const {onChange, className, showBtn, ...rest} = this.props
    return (
      <div className={'file-select'} onClick={this.handleSelectFile}>
        <input id={'file-select-input'} ref={file => this.file = file} hidden={true} type="file" accept={'.mp4'}
               onChange={e => onChange(e)}/>
        {
          showBtn ? (
              <button className={`file-select-btn ${className}`} {...rest}>
                {this.props.children}
              </button>
            ) :
            this.props.children

        }

      </div>
    );
  }
}

export default Index;
