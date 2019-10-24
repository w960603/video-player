import React, {Component} from 'react';

class Slider extends Component {

  state = {
    oldValue: 0,
    currentValue: 0,
    precision: 0,

    // btn states
    hovering: false,
    dragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startPosition: 100,
    newPosition: 100,
  }

  initValue = () => {
    const {value, min, max} = this.props
    let initValue = value
    if (typeof value !== 'number' || isNaN(value)) {
      initValue = min
    } else {
      initValue = Math.min(max, Math.max(min, value))
    }

    return initValue
  }

  componentDidMount() {
    const {min, max, step} = this.props;
    let {currentValue, oldValue, precision} = this.state;

    currentValue = this.initValue();
    oldValue = currentValue;

    let precisions = [min, max, step].map(item => {
      let decimal = ('' + item).split('.')[1];
      return decimal ? decimal.length : 0;
    });

    precision = Math.max.apply(null, precisions);
    this.setState({oldValue, precision, currentValue});
  }

  componentDidUpdate(prevProps) {
    const {min, max, value} = this.props;

    if (prevProps.min != min || prevProps.max != max) {
      this.setValues();
    }
    // '父组件value值改变, 同时改变子组件的currentValue值, 实现视频播放进度自动改变'
    if (prevProps.value !== value) {
      this.setState({
        currentValue: value
      })
    }
  }

  valueChanged() {
    const {currentValue, oldValue} = this.state;
    return currentValue !== oldValue;
  }

  onSliderClick = (e) => {

    const {disabled} = this.props;
    if (disabled) return;


    const sliderOffsetLeft = this.slider.getBoundingClientRect().left;
    this.setPosition((e.clientX - sliderOffsetLeft) / this.sliderSize() * 100);

    this.setValues();
  }
  setValues = () => {
    const {value} = this.props;
    let {currentValue} = this;

    if (typeof value === 'number' && !isNaN(value)) {
      // this.setState({currentValue}, () => {
      if (this.valueChanged()) {
        this.onValueChanged(currentValue);
        this.setState({oldValue: currentValue});
      }
      // });
    }
    this.setState({currentValue});
  }

// 点击进度条时
  onCurrentValueChange(value) {
    const {currentValue} = this.state;
    if (currentValue !== value) {
      this.setState({currentValue: value}, () => this.setValues());
    }
  }

  handleMouseEnter = () => {
    this.setState({
      hovering: true
    })
  }
  handleMouseLeave = () => {
    this.setState({
      hovering: false
    })
  }
// 点击滑块时
  onButtonDown = (event) => {
    if (this.props.disabled) return;
    event.preventDefault();
    this.onDragStart(event);
    window.addEventListener('mousemove', this.onDragging);
    window.addEventListener('touchmove', this.onDragging);
    window.addEventListener('mouseup', this.onDragEnd);
    window.addEventListener('touchend', this.onDragEnd);
    window.addEventListener('contextmenu', this.onDragEnd);
  }
  onDragStart = (event) => {
    if (event.type === 'touchstart') {
      event.clientX = event.touches[0].clientX;
    }

    // 拖拽中, 添加dragging类名用于将鼠标变为手指
    this.setState({
      dragging: true,
      startX: event.clientX,
      currentX: event.clientX,
      startPosition: parseInt(this.currentPosition(), 10)
    })
  }

  onDragging = (event) => {
    console.log('zoule');
    const {dragging, currentX, startX, startPosition, newPosition} = this.state;
    if (dragging) {
      if (event.type === 'touchmove') {
        event.clientX = event.touches[0].clientX;
      }
      this.setState({
        currentX: event.clientX,
      }, () => {
        let diff;
        const sliderSize = this.sliderSize()

        diff = (currentX - startX) / sliderSize * 100;

        const _newPosition = startPosition + diff
        this.setState({
          newPosition: _newPosition
        })
        this.setPosition(_newPosition)

      });
    }
  }

  onDragEnd = () => {
    const {dragging, newPosition} = this.state
    const {onDragEnd} = this.props

    if (dragging) {
      /*
       * 防止在 mouseup 后立即触发 click，导致滑块有几率产生一小段位移
       * 不使用 preventDefault 是因为 mouseup 和 click 没有注册在同一个 DOM 上
       */
      setTimeout(() => {
        this.setState({
          dragging: false
        }, () => {
          this.setPosition(newPosition);
          onDragEnd && onDragEnd()
        })

      }, 0);
      window.removeEventListener('mousemove', this.onDragging);
      window.removeEventListener('touchmove', this.onDragging);
      window.removeEventListener('mouseup', this.onDragEnd);
      window.removeEventListener('touchend', this.onDragEnd);
      window.removeEventListener('contextmenu', this.onDragEnd);
    }
  }

  setPosition = (newPosition) => {
    const {max, min, step} = this.props
    if (newPosition === null || isNaN(newPosition)) return;
    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > 100) {
      newPosition = 100;
    }

    const lengthPerStep = 100 / ((max - min) / step);
    const steps = Math.round(newPosition / lengthPerStep);
    const value = steps * lengthPerStep * (max - min) * 0.01 + min;

    this.currentValue = value
    this.onCurrentValueChange(parseFloat(value.toFixed(this.state.precision)))
  }

  /* watched Methods */
  onValueChanged(val) {
    console.log(val);
    const {onChange} = this.props;
    if (onChange) onChange(val);
  }

  /*---------*/

  /* Computed Methods */
  sliderSize() {
    return parseInt(this.slider[`clientWidth`])
  }

  currentPosition() {
    const {min, max} = this.props
    return `${(this.state.currentValue - min) / (max - min) * 100}%`;
  }

  wrapperStyle() {
    return {left: this.currentPosition()};
  }

  barStyle() {
    return {
      width: this.currentPosition(),
      left: this.barStart()
    };
  }

  barStart() {
    const {range, max, min} = this.props;
    return range
      ? `${100 * min / (max - min)}%`
      : '0%';
  }

  /*---------------*/

  render() {
    return (
      <div className={`slider`}>
        <div className="slider-runway" ref={slider => this.slider = slider} onClick={this.onSliderClick}>
          <div className="slider-bar" style={this.barStyle()}/>
          <div
            className={`slider-btn-wrapper ${this.state.hovering ? 'hover' : ''} ${this.state.dragging ? 'dragging' : ''}`}
            style={this.wrapperStyle()}
            draggable={true}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onMouseDown={this.onButtonDown}
            onTouchStart={this.onButtonDown}
          >
            <div className="slider-btn"/>
          </div>
        </div>
      </div>
    );
  }
}

Slider.defaultProps = {
  step: 1,
  value: 1,
  min: 0,
  max: 100,
  disabled: false
}

export default Slider;
