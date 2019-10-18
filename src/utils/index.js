
export function throttle(fn, delay = 200) {
  let timer = null,
    remaining = 0,
    previous = new Date();

  return function (e) {
    let now = new Date(),
      args = arguments,
      context = this;
    remaining = now - previous
    e.persist && e.persist()   // 解决react异步方式访问事件对象出现的问题
    if (remaining >= delay) {
      if (timer) {
        clearTimeout(timer);
      }

      fn.apply(context, args, e);
      previous = now;
    } else {
      if (!timer) {
        timer = setTimeout(function () {
          fn.apply(context, args, e);
          previous = new Date();
        }, delay - remaining);
      }
    }
  };

}

/*时间转换器*/
export function timeFormat(time) {
  time = parseInt(time);
  var h = addZero(Math.floor(time / 3600));
  var m = addZero(Math.floor((time % 3600) / 60));
  var s = addZero(Math.floor(time % 60));
  return h + ":" + m + ":" + s;
}

function addZero(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return '' + num;
  }
}
