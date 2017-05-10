<template>
  <div class="messageContent">
    <nav>
      <ul>
        <li :class="{'active': isActive === 'a'}" @click="talkA('a')">已读消息</li>
        <li :class="{'active': isActive === 'b'}" @click="talkB('b')">未读消息</li>
      </ul>
    </nav>
    <div v-if="messagItems.length !== 0" class="messageLists">
      <div class="messageList" v-for="messagItem in messagItems">
        <div class="first">
          <div class="firstOne">
            <img :src="messagItem.author.avatar_url">
          </div>
          <div class="firstTwo">
            <p><span class="repalyName">{{messagItem.author.loginname}}</span>回复了您的话题</p>
          </div>
          <div class="firstThree">
            <P><i>{{messagItem.create_at | replyTime}}</i></p>
          </div>
        </div>
        <div class="message" v-html="messagItem.reply.content">
          {{messagItem.reply.content}}
        </div>
        <div class="messageTopic">
          <h2><router-link :to="{ path: 'detail', query: { id: messagItem.topic.id}}">{{messagItem.topic.title}}</router-link></h2>
        </div>
      </div>
    </div>
    <div v-if="messagItems.length === 0" class="userTips">
      <h2>你还没有任何消息哦。。。😎</h2>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import NProgress from 'nprogress'
    export default{
      data () {
        return {
          isActive: 'a',
          messagItems: ''
        }
      },
      methods: {
        talkA (value) {
          this.isActive = value
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/messages', {
            params: {
              accesstoken: this.$store.state.userInfo.token
            }
          }).then((response) => {
            this.messagItems = response.data.data.has_read_messages
            NProgress.done()
          })
        },
        talkB (value) {
          this.isActive = value
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/messages', {
            params: {
              accesstoken: this.$store.state.userInfo.token
            }
          }).then((response) => {
            this.messagItems = response.data.data.hasnot_read_messages
            NProgress.done()
          })
        }
      },
      created () {
        if (!this.$store.state.userInfo.token) {
          this.$router.push({
            path: '/userinfo'
          })
        } else {
          NProgress.start()
          this.axios.get('https://cnodejs.org/api/v1/messages', {
            params: {
              accesstoken: this.$store.state.userInfo.token
            }
          }).then((response) => {
            this.messagItems = response.data.data.has_read_messages
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
  .messageLists{
    padding: 10px 15px;
  }
  .messageList{
    padding: 10px 0;
    border-bottom: 1px solid #F0F0F0;
  }
  .first{
    display: flex;
    position: relative;
    margin-bottom: 5px;
    font-size: 14px;
  }
  .firstOne{
    border: 1px solid #ccc;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .firstOne img{
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .firstTwo p{
    padding: 5px;
    margin: 0;
  }
  .repalyName{
    color: #41B883;
    margin-right:5px;
  }
  .firstThree{
    position: absolute;
    right: 0;
  }
  .firstThree p{
    color: #41B883;
    padding: 5px;
    margin: 0;
  }
  .message{
    padding: 5px 5px 5px 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
  }
  .messageTopic{
    padding: 5px 5px 5px 50px;
  }
  .messageTopic h2{
    margin: 5px 0 0;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
    font-size: 16px;
  }
  .messageTopic h2 a{
    color: #000;
    text-align: justify;
  }
  .messageTopic h2 a:hover{
    color: #41b883;
    text-decoration: underline;
  }
  .userTips{
    text-align: center;
    padding: 10px 0;
  }
</style>

