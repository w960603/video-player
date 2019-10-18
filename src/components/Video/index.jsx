import React from 'react';

function Index(props) {
  console.log(props);
  return (
    <div ref={props.ref1}>
      Video
    </div>
  );
}

export default React.forwardRef((props,ref) => Index(props));
