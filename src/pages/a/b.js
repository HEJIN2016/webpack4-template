/**
 * 获取元素实际样式值
 * @param el dom元素
 * @param styleName 样式名
 */
function getStyle(el, styleName) {
  if (el.currentStyle) return el.currentStyle[styleName];
  if (getComputedStyle) return window.getComputedStyle(el, null)[styleName];
  return el.style[styleName];
}

// 优雅降级requestAnimationFrame
const requestAnimationF = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    // if all else fails, use setTimeout
    function (callback) {
      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
    };
})();

// 优雅降级cancelAnimationFrame
const cancelAnimationF = (function () {
  return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    function (id) {
      window.clearTimeout(id);
    };
})();


/**
 * 获取元素实际高度
 * @param el  dom元素
 * @returns {number} 元素高度
 */
function getHeight(el) {
  let height;
  // 已隐藏的元素
  if (getStyle(el, "display") === "none") {
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.display = "block";
    height = getStyle(el, "height");
    el.style.position = "";
    el.style.visibility = "";
    el.style.display = "";
    return parseFloat(height);
  }
  return parseFloat(getStyle(el, "height"));
}

/**
 * 获取已隐藏元素的css值
 * @param el
 * @param styleName
 * @returns {*}
 */
function getCurrentStyle(el, styleName) {
  let styleValue;
  // 已隐藏的元素
  if (getStyle(el, "display") === "none") {
    el.style.position = "absolute";
    el.style.visibility = "hidden";
    el.style.display = "block";
    styleValue = getStyle(el, styleName);
    el.style.position = "";
    el.style.visibility = "";
    el.style.display = "";
    return (styleValue);
  }
  return (getStyle(el, styleName));
}

/**
 * 优化实现sildeToggle效果
 * @param el dom元素
 * @param time 动画时长，单位ms，默认值300
 * @param fn 回调函数
 */
function slideToggle(el, time, fn) {
  if (!el) return false;
  time = time || 300;
  if (el.dataUid) return false; // 如该dom元素已有动画未处理完，则必须等到动画结束才执行

  cancelAnimationF(el.dataUid);

  // 已隐藏的元素，下拉
  if (getStyle(el, "display") === "none" || getHeight(el) === 0) {
    let aniSplitTime = Date.now();

    let height = 0, paddingTop = 0, paddingBottom = 0;
    let totalHeight = parseFloat(getCurrentStyle(el, "height"));
    let totalPaddingTop = parseFloat(getCurrentStyle(el, "paddingTop"));
    let totalPaddingBottom = parseFloat(getCurrentStyle(el, "paddingBottom"));

    let basePaddingBottom = totalPaddingBottom/time;
    let basePaddingTop = totalPaddingBottom/time;
    let baseHeight = totalHeight/time;

    el.style.overflow = "hidden";
    el.style.display = "block";

    el.dataUid = requestAnimationF(function go(){
      let aniTime = Date.now();
      let splitTime = aniTime - aniSplitTime;
      aniSplitTime = aniTime;
      let splitPaddingBottom = basePaddingBottom*splitTime;
      let splitPaddingTop = basePaddingTop*splitTime;
      let splitHeight = baseHeight*splitTime;

      if (height >= totalHeight){
        el.style.overflow = "";
        el.style.height = "";
        el.style.paddingTop = "";
        el.style.paddingBottom = "";

        if (fn && typeof fn === "function") fn();
        cancelAnimationF(el.dataUid);
        el.dataUid = null;
        delete el.dataUid;
      } else {
        el.style.height = height + "px";
        el.style.paddingTop = paddingTop + "px";
        el.style.paddingBottom = paddingBottom + "px";
        el.dataUid = requestAnimationF(go);
      }
      height = height + splitHeight;
      paddingTop = paddingTop + splitPaddingTop;
      paddingBottom = paddingBottom + splitPaddingBottom;
    });

  } else {
    // 上拉
    let aniSplitTime = Date.now();
    let height = getHeight(el);
    let paddingTop = parseFloat(getStyle(el, "paddingTop"));
    let paddingBottom = parseFloat(getStyle(el, "paddingBottom"));
    el.style.overflow = "hidden";

    let basePaddingBottom = paddingBottom/time;
    let basePaddingTop = paddingTop/time;
    let baseHeight = height/time;

    el.dataUid = requestAnimationF(function go(){
      let aniTime = Date.now();
      let splitTime = aniTime - aniSplitTime;
      aniSplitTime = aniTime;
      let splitPaddingBottom = basePaddingBottom*splitTime;
      let splitPaddingTop = basePaddingTop*splitTime;
      let splitHeight = baseHeight*splitTime;

      if (height <= 0) {
        el.style.height = 0;
        el.style.paddingTop = 0;
        el.style.paddingBottom = 0;

        setTimeout(()=>{
          el.style.height = "";
          el.style.overflow = "";
          el.style.paddingTop = "";
          el.style.paddingBottom = "";
          el.style.display = "none";
        },0);

        if (fn && typeof fn === "function") fn();
        cancelAnimationF(el.dataUid);
        el.dataUid = null;
        delete el.dataUid;
      } else {
        el.style.height = height + "px";
        el.style.paddingTop = paddingTop + "px";
        el.style.paddingBottom = paddingBottom + "px";
        el.dataUid = requestAnimationF(go);
      }

      height = height - splitHeight;
      paddingBottom = paddingBottom - splitPaddingBottom;
      paddingTop = paddingTop - splitPaddingTop;
    });
  }
}

$("body").click(function(){
  slideToggle($(".bg")[0], 600);
});