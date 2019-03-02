<template>
  <section class="app-main">
    <div class="centent">
      <transition name="fade-transform" mode="out-in">
        <!-- or name="fade" -->
        <!-- <router-view :key="key"></router-view> -->
        <router-view/>
      </transition>
    </div>
    <div class="footer">
      <div class="item">
        <el-button type="text">帮助</el-button>
        <el-button type="text">隐私</el-button>
        <el-button type="text">条款</el-button>
      </div>
      <div class="item">
        <span>copyright</span><svg-icon icon-class="copyright"/><span></span><span> 2019 北京衣点达软件有限公司</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.app-main {
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  background-color: rgba(#ddd, 0.4);
  padding: 10px;

  .centent {
    background-color: #fff;
  }
  .footer {
    background-color: #fff;
    padding: 30px 0;

    .item {
      color: rgba(#111, 0.4);
      font-size: 13px;
      text-align: center;
    }
  }
}
</style>
