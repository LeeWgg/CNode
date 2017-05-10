<template>
    <div class="aboutContent">
      <div class="first">
        <h3>关于项目</h3>
        <p>该项目是采用<a href="https://cnodejs.org/api">Cnode</a>社区提供的api，基于vue2.0重写。</p>
      </div>
      <div class="second">
        <h3>源码地址</h3>
        <p><a href="https://github.com/LeeWgg/CNode" target="_blank">https://github.com/LeeWgg/CNode</a></p>
      </div>
      <div class="third">
        <h3>意见反馈</h3>
        <p><a href="https://github.com/LeeWgg/CNode/issues" target="_blank">发表意见或者提需求</a></p>
      </div>
      <div class="fourthly">
        <h3>当前版本</h3>
        <p>vue2.0</p>
      </div>
      <div class="fifths">
        <h3>关于登录</h3>
        <p>如何获取 accessToken？前往<a href="https://cnodejs.org/" target="_blank">Cnode</a>社区，用户登录后，在设置页面可以看到自己的 accessToken。</p>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import NProgress from 'nprogress'
    export default{
      data () {
        return {
        }
      },
      created () {
        NProgress.start()
        NProgress.done()
      }
    }
</script>

<style lang="css" scoped>
.aboutContent{
  padding:10px;
}
.aboutContent div{
  border-bottom: 1px solid #F0F0F0;
}
</style>

