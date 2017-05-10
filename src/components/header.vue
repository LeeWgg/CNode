<template>
  <div class="header">
    <ul class="firstnav">
      <li>
        <h3 class="logo"><img src="../assets/logo.png"><i>CNODEJS</i></h3>
      </li>
      <li><router-link to="/">首页</router-link></li>
      <li><router-link to="/create">发表</router-link></li>
      <li><router-link to="/messages">消息</router-link></li>
      <li><router-link to="/userinfo">我的</router-link></li>
      <li><router-link to="/about">关于</router-link></li>
    </ul>
  </div>

</template>

<script type="text/ecmascript-6">
export default {
  name: 'header',
  data () {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
  ul{
    list-style-type: none
  }
  .header{
    /*box-shadow: 0 0 1px rgba(0,0,0,0.25);*/
    box-shadow: 0 1px 4px #ccc;
    font-size: 15px;
    background: #fff;
    position: fixed;
    width: 100%;
    top:0;
    /*min-width: 1000px;*/
  }
  .firstnav{
    display:block;
    width: 1000px;
    padding:0;
    margin: 0 auto;
  }
  .firstnav>li {
    float: left;
    display: inline-block;
    height: 50px;
    margin: 10px 0;
  }
  .firstnav>li>a{
    line-height: 50px;
    padding:5px 10px;
    margin: 0 10px;
    /*border-bottom: 2px solid #41B883;*/
  }
  .firstnav>li>a:hover{
    /*border-bottom: 2px solid #41B883;*/
    background: #F3F3F3;
    border-radius: 2px;
  }
  .logo{
    margin: 0 100px 0 0;
    color: #41B883;
  }
  .logo img{
    display: inline-block;
    width: 50px;
    height: 50px;
  }
</style>
