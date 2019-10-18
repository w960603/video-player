import React, {Component} from 'react';

class Index extends Component {

  render() {
    return (
      <div>
        {
          this.props.videoList.map(item=>{
            const src = item.url
            return <div key={item.timestamp} onClick={()=>this.props.onClick(src)}>{item.fileName}</div>
          })
        }
      </div>
    );
  }
}

export default Index;
