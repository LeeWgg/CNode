<template>
    <div class="edit">
      <div class="articleTitle">
        <input type="text" placeholder="标题" v-model="articleTitle"><span>10个字数以上！</span>
      </div>
      <div class="articleTab">
        选择发布到：
        <select v-model="articleTab">
          <option value ="share">分享</option>
          <option value ="ask">问答</option>
          <option value="job">招聘</option>
        </select>
      </div>
      <div class="articleContent" id="editorDiv">
        <p>请输入内容。。。</p>
      </div>
      <div class="articleButton">
        <div>
          <input type="button" value="发布文章" @click="shareArticle">
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import WangEditor from 'wangeditor'
    import $ from 'jquery'
    import NProgress from 'nprogress'
    export default{
      data () {
        return {
          articleTitle: '',
          articleTab: 'share',
          articleContent: ''
        }
      },
      methods: {
        shareArticle () {
          let _this = this
          NProgress.start()
          _this.axios.post('https://cnodejs.org/api/v1/topics', {
            accesstoken: _this.$store.state.userInfo.token,
            title: _this.articleTitle,
            tab: _this.articleTab,
            content: _this.articleContent
          }).then((response) => {
            console.log(response.data)
            NProgress.done()
            _this.$router.push({
              path: '/'
            })
          }).catch(function (error) {
            _this.$message({
              message: error.response.data.error_msg,
              type: 'error'
            })
            NProgress.done()
          })
        }
      },
      mounted () {
        let _this = this
        let editor = new WangEditor('editorDiv')
        // 配置表情包
        editor.config.emotions = {
          'default': {
            title: '默认',  // 组名称
            data: 'http://www.wangeditor.com/wangEditor/test/emotions.data'
          }
        }
        // 阻止输出log
        WangEditor.config.printLog = false
        // 配置 onchange 事件
        editor.onchange = function () {
          // 编辑区域内容变化时，实时打印出当前内容
          _this.articleContent = this.$txt.html()
        }
        // 移除一些菜单栏
        editor.config.menus = $.map(WangEditor.config.menus, function (item, key) {
          if (item === 'source') {
            return null
          }
          if (item === 'fullscreen') {
            return null
          }
          if (item === 'video') {
            return null
          }
          if (item === 'location') {
            return null
          }
          return item
        })
        editor.create()
      },
      created () {
        if (!this.$store.state.userInfo.token) {
          this.$router.push({
            path: '/userinfo'
          })
        }
        NProgress.start()
        NProgress.done()
      }
    }
</script>

<style lang="css" scoped>
  .edit{
    padding:20px 10px ;
    color: #2c3e50;
    position: relative;
    margin-bottom: 100px;
  }
  .articleTitle input{
    display:inline-block;
    width: 80%;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    padding: 0 10px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  .articleTitle span{
    margin-left: 20px;
  }
  .articleTab{
    margin: 20px 0;
  }
  .articleTab select{
    width: 150px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 12px;
    padding: 0 5px;
  }
  .articleContent{
    height:700px;
  }
  .articleButton{
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 65px;
    border-top: 1px solid #ccc;
    z-index: 100;
    box-shadow: 0px -1px 2px 0px rgba(0,0,0,0.24);
  }
  .articleButton div{
    width: 1000px;
    margin: auto;
    height: 100%;
    position: relative;
  }
  .articleButton input{
    position: absolute;
    color: #fff;
    background-color: #41B883;
    border: none;
    display: inline-block;
    margin-bottom: 0;
    font-weight: normal;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.5;
    border-radius: 3px;
    right: 0;
    top: 15px;
  }
  .articleButton input:hover{
    background-color: #006741;
  }
</style>

