<template>
    <div class="userinfo">
      <div class="login" v-if="!this.$store.state.userInfo.userId">
        <img src="../assets/logo.png">
        <br>
        <input class="inputToken" type="text" v-model="userToken" placeholder="请输入您的Access Token"  maxlength="36">
        <br>
        <input class="inputButton" type="button" value="登录" @click="login">
      </div>
      <div class="content" v-if="this.$store.state.userInfo.userId">
        <input class="logout" title="退出" type="button" value="退出" @click="logout">
        <div class="fistContent">
          <div class="avator">
            <img :title="userContent.loginname" :src="userContent.avatar_url">
          </div>
          <div class="userdetail">
            <h3>{{userContent.loginname}}</h3>
            <p><i class="fa fa-github fa-2x"></i>&nbsp;：{{userContent.githubUsername}}</p>
            <p>
              <span>创建时间：{{userContent.create_at | replyTime}}</span>
              &nbsp;&nbsp;
              <span>积分：{{userContent.score}}</span>
            </p>
          </div>
        </div>
        <div class="secondContent">
          <nav>
            <ul>
              <li :class="{'active': isActive === 'a'}" @click="talkA('a')">最近创建的话题</li>
              <li :class="{'active': isActive === 'b'}" @click="talkB('b')">最近参与的话题</li>
              <li :class="{'active': isActive === 'c'}" @click="talkC('c')">收藏的话题</li>
            </ul>
          </nav>
          <div class="othertopic">
            <div v-if="articleItems.length !== 0" class="article" v-for="article in articleItems">
              <div class="articleAvator">
                <img :title="article.author.loginname" :src="article.author.avatar_url">
              </div>
              <div class="articleTitle">
                <p>{{article.author.loginname}}<i>{{article.last_reply_at | replyTime}}更新</i></p>
                <h2><router-link :to="{ path: 'detail', query: { id: article.id}}" :title="article.title">{{article.title}}</router-link></h2>
              </div>
            </div>
            <div v-if="articleItems.length === 0" class="userTips">
              <h2>暂无内容哦。。。🙃</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import NProgress from 'nprogress'
    export default{
      data () {
        return {
          userToken: '',
          isHidden: false,
          userContent: '',
          isActive: 'a',
          articleItems: ''
        }
      },
      methods: {
        login () {
          if (this.userToken === '') {
            this.$message({
              message: '令牌格式错误,应为36位UUID字符串',
              type: 'warning'
            })
            return false
          }
          let _this = this
          NProgress.start()
          _this.axios.post('https://cnodejs.org/api/v1/accesstoken', {
            accesstoken: _this.userToken
          }).then((response) => {
            let user = {
              loginname: response.data.loginname,
              avatar_url: response.data.avatar_url,
              userId: response.data.id,
              token: _this.userToken
            }
            sessionStorage.user = JSON.stringify(user)
            _this.$store.dispatch('setUserInfo', user)
            _this.$message({
              message: '登录成功',
              type: 'success'
            })
            _this.axios.get('https://cnodejs.org/api/v1/user/' + _this.$store.state.userInfo.loginname).then((response) => {
              _this.userContent = response.data.data
              _this.articleItems = response.data.data.recent_topics
            })
            NProgress.done()
          }).catch(function (error) {
            _this.$message({
              message: error.response.data.error_msg,
              type: 'error'
            })
            NProgress.done()
          })
        },
        talkA (value) {
          this.isActive = value
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/user/' + this.$store.state.userInfo.loginname).then((response) => {
            this.articleItems = response.data.data.recent_topics
            NProgress.done()
          })
        },
        talkB (value) {
          this.isActive = value
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/user/' + this.$store.state.userInfo.loginname).then((response) => {
            this.articleItems = response.data.data.recent_replies
            NProgress.done()
          })
        },
        talkC (value) {
          this.isActive = value
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/topic_collect/' + this.$store.state.userInfo.loginname).then((response) => {
            this.articleItems = response.data.data
            NProgress.done()
          })
        },
        logout () {
          sessionStorage.clear()
          window.location.reload()
        }
      },
      created () {
        if (this.$store.state.userInfo.userId) {
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/user/' + this.$store.state.userInfo.loginname).then((response) => {
            this.userContent = response.data.data
            this.articleItems = response.data.data.recent_topics
            NProgress.done()
          })
        }
      },
      filters: {
        replyTime (value) {
          if (!value) {
            return ''
          }
          let date = new Date(value)
          let time = new Date().getTime() - date.getTime() // 现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
          if (time < 0) {
            return ''
          } else if ((time / 1000 < 30)) {
            return '刚刚'
          } else if (time / 1000 < 60) {
            return parseInt((time / 1000)) + '秒前'
          } else if ((time / 60000) < 60) {
            return parseInt((time / 60000)) + '分钟前'
          } else if ((time / 3600000) < 24) {
            return parseInt(time / 3600000) + '小时前'
          } else if ((time / 86400000) < 31) {
            return parseInt(time / 86400000) + '天前'
          } else if ((time / 2592000000) < 12) {
            return parseInt(time / 2592000000) + '月前'
          } else {
            return parseInt(time / 31536000000) + '年前'
          }
        }
      }
    }
</script>

<style lang="css" scoped>
  input::-webkit-input-placeholder { /* WebKit browsers */
    color:#41B883;
  }
  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color:#41B883;
  }
  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color:#41B883;
  }
  input:-ms-input-placeholder { /* Internet Explorer 10+ */
    color:#41B883;
  }
  .userinfo{
    padding: 20px;
  }
  .login{
    text-align: center;
  }
  .login input{
    display: inline-block;
  }
  .inputToken{
    border: none;
    border-bottom: 2px solid #41B883;
    width: 230px;
    height: 30px;
    color: #41B883;
    padding:0 5px;
    outline: none;
    font-size: 12px;
    margin: 20px 0;
  }
  .inputButton{
    border: none;
    background: #41B883;
    color: #fff;
    width: 250px;
    height: 35px;
    border-radius: 2px;
    margin: 20px 0;
    outline: none;
    cursor: pointer;
  }
  .inputButton:hover{
    background-color: #006741;
  }
  .content{
    position: relative;
  }
  .logout{
    position: absolute;
    right: 0;
    border: none;
    cursor: pointer;
    color: #fff;
    background: #41B883;
    border-radius: 2px;
    padding: 2px 5px;
    outline: none;
  }
  .logout:hover{
    background-color: #006741;
  }
  .fistContent{
    display: flex;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
  }
  .avator{
    border: 1px solid #ccc;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .avator img{
    display: inline-block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .userdetail{
    padding: 0 20px;
  }
  .userdetail h3{
    margin-top: 0;
    margin-bottom: 10px;
  }
  .userdetail p{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  nav ul{
    list-style: none;
    display: flex;
    width: 100%;
    padding: 0;
  }
  nav li{
    width: 50%;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
  }
  nav li:hover{
    color: #41B883;
  }
  .active{
    color: #41B883;
  }
  .article{
    display: flex;
    border-bottom: 1px solid #F0F0F0;
    padding: 15px 0;
  }
  .articleAvator{
    border: 1px solid #ccc;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .articleAvator img{
    display: inline-block;
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }
  .articleTitle{
    width: 100%;
  }
  .articleTitle p{
    margin: 0;
    font-size: 12px;
    position: relative;
  }
  .articleTitle p i {
    position: absolute;
    right: 0;
    color: #41B883;
  }
  .articleTitle h2{
    margin: 5px 0 0;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
    font-size: 16px;
  }
  .articleTitle h2 a{
    color: #000;
  }
  .articleTitle h2 a:hover{
    color: #41b883;
    text-decoration: underline;
  }
  .userTips{
    text-align: center;
    padding: 10px 0;
  }
</style>

