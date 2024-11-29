<template>
  <div class='loading-undulate'>
    <div :class='`rect${i}`' v-for='i in 5' :key='i'></div>
  </div>
</template>

<style lang='less'>
@import '../../theme.less';

.loading-undulate {
  display: inline-block;

  height: 36px;

  text-align: center;

  font-size: 10px;
}

.loading-undulate > div {
  display: inline-block;

  width: 3px;
  height: 100%;
  margin-right: 3px;

  //动画一个完整周期为1.2s
  animation: stretchdelay 1.2s infinite ease-in-out;

  border-radius: 500px;
  background-color: @primary-color;
}

//animation-delay 负值设置多少，动画跳过多少秒进入动画周期

.loading-undulate {
  .rect2 {
    // 预先执行1.1s
    animation-delay: -1.1s;
  }

  .rect3 {
    // 预先执行1.0s
    animation-delay: -1.0s;
  }

  .rect4 {
    // ...以此类推
    animation-delay: -0.9s;
  }
  .rect5 {
    animation-delay: -0.8s;
  }

  @keyframes stretchdelay {
    0% {
      transform: scaleY(0.5);
    }
    20% {
      transform: scaleY(1.0);
    }
    40% {
      transform: scaleY(0.5);
    }
    100% {
      transform: scaleY(0.5);
    }
  }
}
</style>
