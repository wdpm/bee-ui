<template>
  <svg class='loading-pie'>
    <!--    单位1x1框中绘制一个内切圆，r=0.4，描边2，填充无-->
    <circle class='pie' cx='50%' cy='50%' r='40%' stroke-width='2' fill='none'></circle>
  </svg>
</template>

<style lang='less'>
.loading-pie {
  display: inline-block;

  width: 32px;
  height: 32px;

  // 父级正方形框围绕自身几何中心不断旋转
  animation: rotate 1.6s linear infinite;

  .pie {
    //animation: pie 1.6s ease infinite;
    //animation: colors 6.4s ease infinite;
    animation: pie 1.6s ease infinite, colors 6.4s ease infinite;

    // makes the ends of the stroke rounded.
    stroke-linecap: round;
  }

  @keyframes rotate {
    100% {
      transform: rotate(1turn);
    }
  }

  //https://developer.mozilla.org/en-US/docs/Web/CSS/stroke-dasharray
  //stroke-dasharray: 10 5;
  //含义是10长度的描边，5单位的空白

  //https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/stroke-dashoffset

  // Thus, positive values will appear to shift the dash-gap pattern backwards,
  // and negative values will appear to shift the pattern forwards.

  //stroke-dashoffset="2"
  // 正值表示向后偏移，负值表示向前偏移。

  // 其他参考教程：https://www.cnblogs.com/daisygogogo/p/11044353.html

  // 旋转视觉效果的关键在于这个动画定义
  @keyframes pie {
    0% {
      stroke-dasharray: 0%, 400%;
      stroke-dashoffset: 0%;
    }
    50% {
      stroke-dasharray: 200%, 400%;
      // 这里务必给一个负的百分比，让旋转稍微往前冲一点距离，但是不能太大，如果是-200%，则冲刺过于剧烈。
      stroke-dashoffset: -20%;
    }
    100% {
      stroke-dasharray: 0%, 400%;
      // 必须是负偏移，如果是250%，则会大幅度截断视觉上的描边宽度，旋转动画发生间断。
      stroke-dashoffset: -250%;
    }
  }

  /*color gradient change，颜色平滑渐变*/
  @keyframes colors {
    0% {
      stroke: #d62d20;
    }
    25% {
      stroke: #0057e7;
    }
    50% {
      stroke: #008744;
    }
    75% {
      stroke: #ffa700;
    }
    100% {
      stroke: #d62d20;
    }
  }
}
</style>
