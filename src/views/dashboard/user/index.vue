<template>
  <div class="user animateClass">
    <p class="user_p0">Teamer App</p>
    <p class="user_p1">欢迎来到Teamer后台管理</p>
    <div class="user_img" ref="aniEnd">
      <img src="https://cn.vuejs.org/images/logo.png" alt="vue" />
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.animateClass {
  .user_p0,
  .user_p1,
  .user_img {
    animation: bounceInUp 1s;
  }
}
.user {
  overflow: hidden;
  .user_p0 {
    font-size: 36px;
    text-align: center;
    padding-top: 55px;
    animation-fill-mode: forwards;
  }
  .user_p1 {
    font-size: 20px;
    text-align: center;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }
  .user_img {
    text-align: center;
    margin-top: 46px;
    animation-delay: 0.1s;
    animation-fill-mode: forwards;
  }
}
</style>
