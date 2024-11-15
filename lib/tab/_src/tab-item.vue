<template>
  <section class="bee-tab--item">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'BeeTabItem',
  props: {
    // 仅需要一个label字段
    label: String
  }
}
</script>
