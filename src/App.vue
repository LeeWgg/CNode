<template>
  <div id="app">
    <vheader></vheader>
    <div class="empyt"></div>
    <div class="allcontent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vheader from './components/header.vue'
  export default {
    name: 'app',
    components: { vheader }
  }
</script>

<style lang="css">
@import "../node_modules/font-awesome/css/font-awesome.min.css";
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: -1000;
}
a{
  color:#41B883 ;
  text-decoration: none;
  text-align: center;
}
.empyt{
  width: 100%;
  height: 70px;
}
.allcontent{
  width:1000px;
  /*height: 100%;*/
  margin: 20px auto;
  border-top: 1px solid #dbe2e8;
  border-left: 1px solid #dbe2e8;
  border-right: 1px solid #dbe2e8;
  box-shadow: 0 1px 2px rgba(46,61,73,.08);
  border-radius: 4px;
  padding:0 10px ;
  background: #fff;
  position: relative;
  z-index: -500;
}
/*进度条样式*/
#nprogress .bar {
  background: #41B883!important;

  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;

  width: 100%;
  height: 2px;
}
#nprogress .peg {
  display: block;
  position: absolute;
  right: 0px;
  width: 100px;
  height: 100%;
  box-shadow: 0 0 10px #41B883, 0 0 5px #41B883!important;
  opacity: 1.0;

  -webkit-transform: rotate(3deg) translate(0px, -4px);
  -ms-transform: rotate(3deg) translate(0px, -4px);
  transform: rotate(3deg) translate(0px, -4px);
}
#nprogress .spinner-icon {
  width: 18px;
  height: 18px;
  box-sizing: border-box;

  border: solid 2px transparent;
  border-top-color: #41B883!important;
  border-left-color: #41B883!important;
  border-radius: 50%;

  -webkit-animation: nprogress-spinner 400ms linear infinite;
  animation: nprogress-spinner 400ms linear infinite;
}
/*文章内容*/
.markdown-text img{
  display: block;
  margin-bottom: 20px;
  max-width: 100%;
  vertical-align: middle;
}
.markdown-text hr{
  margin: 20px 0;
  border: 0;
  border-bottom: 1px solid #eaecef;
}
.markdown-text table{
  margin: 16px 0;
}
.markdown-text pre {
  padding: 9.5px;
  margin: 0 10px 10px;
  font-size: 13px;
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
}
.markdown-text pre.prettyprint {
  font-size: 14px;
  border-radius: 0;
  padding:15px;
  border: none;
  margin: 20px 10px;
  border-width: 1px 0;
  background: #f7f7f7;
  -o-tab-size: 4;
  -moz-tab-size: 4;
  tab-size: 4;
}
.markdown-text blockquote {
  padding: 0 0 0 15px;
  margin: 0 0 20px;
  border-left: 5px solid #eee;
}
</style>
