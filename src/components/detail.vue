<template>
  <div class="articleDetails" v-if="articleDetails">
    <div class="titleInfo">
      <div class="tags">
        <span v-show="articleDetails.data.top">置顶</span>
        <span v-show="articleDetails.data.good">精华</span>
        <span v-show="articleDetails.data.tab === 'share'">分享</span>
        <span v-show="articleDetails.data.tab === 'ask'">回答</span>
        <span v-show="articleDetails.data.tab === 'job'">招聘</span>
      </div>
      <h2>{{ articleDetails.data.title}}</h2>
      <div class="titileOthers">
        <div class="info">
          <div class="avator">
            <img :title="articleDetails.data.author.loginname" :src="articleDetails.data.author.avatar_url">
          </div>
          <div class="avatorName">
            <a>{{articleDetails.data.author.loginname}}</a>
          </div>
          <div class="time">
            <span>{{articleDetails.data.create_at | replyTime}}</span>
          </div>
          <div class="look">
            <span><i class="fa fa-eye"></i>{{articleDetails.data.visit_count}}</span>
          </div>
          <div class="remark">
            <span><i class="fa fa-commenting-o"></i>{{articleDetails.data.reply_count}}</span>
          </div>
          <input v-show="articleDetails.data.is_collect===false" class="collect" @click="collect" type="button" value="收藏">
          <input v-show="articleDetails.data.is_collect===true" class="collect" @click="cancelCollect" type="button" value="取消收藏">
        </div>
      </div>
    </div>
    <div class="articleContet" v-html="articleContent">
      {{articleContent}}
    </div>
    <div class="comment">
      <div class="commentNum">
        <h3>评论（{{commentInfo.length}}）</h3>
      </div>
      <div class="remarkOn"  v-if="this.$store.state.userInfo.userId">
        <div class="remarkOnavatar">
          <img :title="userName" :src="userImg">
        </div>
        <textarea v-model="commentText">

        </textarea>
        <input type="button" value="发送" @click="submitComent(articleDetails.data.id)">
      </div>
      <div class="commentDetails" v-for="(comment, index) in commentInfo">
        <div class="commentuseravatar">
          <img :title="comment.author.loginname" :src="comment.author.avatar_url">
        </div>
        <div class="commentInfo">
          <p class="commentusername"><a>{{comment.author.loginname}}</a>&nbsp;&nbsp;<span>#{{index+1}}楼</span></p>
          <div class="commentcontent" v-html="comment.content">
            {{comment.content}}
          </div>
          <div class="commentOther">
            <span>{{comment.create_at | replyTime}}</span>
            <a class="commentReply" @click="emergeReply(index, comment.author.loginname)">回复</a>
            <span class="commentHeart" @click="heart(comment)" :class="{heartActive: isUps(comment.ups)}"><i class="fa fa-heart-o"></i>&nbsp;{{comment.ups.length}}</span>
          </div>
          <div class="comentReply" :class="{isEmerge: replyNum===index}">
            <textarea v-model="replyText">

            </textarea>
            <input type="button" value="回复" @click="replies(articleDetails.data.id, comment.id)">
          </div>
        </div>
      </div>
      <div v-if="commentInfo.length === 0" class="commentTips">
        <h2>暂无评论哦。。。🤣</h2>
      </div>
    </div>
    <vtop></vtop>
  </div>
</template>

<script type="text/ecmascript-6">
    import NProgress from 'nprogress'
    import $ from 'jquery'
    import vtop from './backtop.vue'
    export default{
      data () {
        return {
          articleDetails: '',
          articleContent: '',
          commentInfo: '',
          isheart: true,
          userName: '',
          userImg: '',
          commentText: '',
          replyText: '',
          replyNum: ''
        }
      },
      components: { vtop },
      methods: {
        collect () {
          if (!this.$store.state.userInfo.token) {
            this.$router.push({
              path: '/userinfo'
            })
          } else {
            this.axios.post('https://cnodejs.org/api/v1/topic_collect/collect', {
              accesstoken: this.$store.state.userInfo.token,
              topic_id: this.articleDetails.data.id
            }).then((response) => {
              console.log(response.data)
              this.articleDetails.data.is_collect = true
            })
          }
        },
        cancelCollect () {
          this.axios.post('https://cnodejs.org/api/v1/topic_collect/de_collect', {
            accesstoken: this.$store.state.userInfo.token,
            topic_id: this.articleDetails.data.id
          }).then((response) => {
            console.log(response.data)
            this.articleDetails.data.is_collect = false
          })
        },
        heart (value) {
          if (!this.$store.state.userInfo.token) {
            this.$router.push({
              path: '/userinfo'
            })
          } else {
            let _this = this
            this.axios.post('https://cnodejs.org/api/v1/reply/' + value.id + '/ups', {
              accesstoken: this.$store.state.userInfo.token
            }).then((response) => {
              console.log(response.data.action)
              if (response.data.action === 'down') {
                let index = $.inArray(this.$store.state.userInfo.userId, value.ups)
                value.ups.splice(index, 1)
              } else {
                value.ups.push(this.$store.state.userInfo.userId)
              }
            }).catch(function (error) {
              _this.$message({
                message: error.response.data.error_msg,
                type: 'error'
              })
            })
          }
        },
        isUps (ups) {
          return $.inArray(this.$store.state.userInfo.userId, ups) >= 0
        },
        submitComent (value) {
          if (this.commentText === '') {
            this.$message({
              message: '请输入内容',
              type: 'error'
            })
          }
          this.axios.post('https://cnodejs.org/api/v1//topic/' + value + '/replies', {
            accesstoken: this.$store.state.userInfo.token,
            content: this.commentText
          }).then((response) => {
            console.log(response.data)
            if (response.data.success === true) {
              this.$message({
                message: '评论成功',
                type: 'success'
              })
              this.commentText = ''
              NProgress.start()
              this.axios.get('https://cnodejs.org/api/v1/topic/' + this.$route.query.id, {
                params: {
                  accesstoken: this.$store.state.userInfo.token
                }
              }).then((response) => {
                this.articleDetails = response.data
                this.articleContent = response.data.data.content
                this.commentInfo = response.data.data.replies
                NProgress.done()
              })
            } else {
              this.$message({
                message: '评论失败',
                type: 'error'
              })
            }
          })
        },
        emergeReply (index, value) {
          if (this.replyNum === index) {
            this.replyNum = ''
          } else {
            this.replyNum = index
            this.replyText = '@' + value
          }
        },
        replies (value1, value2) {
          if (!this.$store.state.userInfo.token) {
            this.$router.push({
              path: '/userinfo'
            })
          } else {
            if (this.replyText === '') {
              this.$message({
                message: '请输入内容',
                type: 'error'
              })
            }
            this.axios.post('https://cnodejs.org/api/v1//topic/' + value1 + '/replies', {
              accesstoken: this.$store.state.userInfo.token,
              content: this.replyText,
              reply_id: value2
            }).then((response) => {
              console.log(response.data)
              if (response.data.success === true) {
                this.$message({
                  message: '回复成功',
                  type: 'success'
                })
                this.replyNum = ''
                NProgress.start()
                this.axios.get('https://cnodejs.org/api/v1/topic/' + this.$route.query.id, {
                  params: {
                    accesstoken: this.$store.state.userInfo.token
                  }
                }).then((response) => {
                  this.articleDetails = response.data
                  this.articleContent = response.data.data.content
                  this.commentInfo = response.data.data.replies
                  NProgress.done()
                })
              } else {
                this.$message({
                  message: '评论失败',
                  type: 'error'
                })
              }
            })
          }
        }
      },
      created () {
        this.userName = this.$store.state.userInfo.loginname
        this.userImg = this.$store.state.userInfo.avatar_url
        NProgress.start()
        let _this = this
        this.axios.get('https://cnodejs.org/api/v1/topic/' + this.$route.query.id, {
          params: {
            accesstoken: this.$store.state.userInfo.token
          }
        }).then((response) => {
          this.articleDetails = response.data
          this.articleContent = response.data.data.content
          this.commentInfo = response.data.data.replies
          NProgress.done()
        }).catch(function (error) {
          console.log(error)
          _this.$message({
            message: error.response.data.error_msg,
            type: 'error'
          })
          NProgress.done()
          window.history.go(-1)
        })
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
  .tags{
    font-size: 12px;
    margin-top: 10px;
  }
  .tags>span{
    background: #41b883;
    color: #fff;
    padding: 2px 4px;
    border-radius: 2px;
  }
  .avator{
    border: 1px solid #ccc;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
  }
  .avator img{
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .avatorName{
    display: inline-block;
    vertical-align: super;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .time{
    display: inline-block;
    vertical-align: super;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .look{
    display: inline-block;
    vertical-align: super;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .look i{
    margin-right: 5px;
  }
  .remark{
    display: inline-block;
    vertical-align: super;
    height: 30px;
    margin-right: 10px;
    font-size: 14px;
  }
  .remark i{
    margin-right: 5px;
  }
  .collect{
    float: right;
    vertical-align: middle;
    height: 30px;
    background: #41b883;
    border: none;
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
  }
  .collect:hover{
    background-color: #006741;
  }
  .articleContet{
    margin-top: 20px;
    text-align: justify;
  }
  .comment {padding: 10px 0}
  .comment h3{
    border-top: 1px solid #eaecef;
    padding-top: 20px;
    margin-top: 30px;
  }
  .commentDetails{
    display: flex;
    padding: 20px 0;
  }
  .commentuseravatar{
    border: 1px solid #ccc;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
  }
  .commentuseravatar img{
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .commentInfo{
    margin-right: 50px;
    width: 100%;
  }
  .commentusername{
    margin-top: 0;
  }
  .commentcontent{
    text-align: justify;
    font-size: 13px;
  }
  .commentOther{
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 13px;
    position: relative;
  }
  .commentReply{
    position: absolute;
    right: 100px;
    color: #2c3e50;
    cursor: pointer;
  }
  .commentHeart{
    position: absolute;
    left:91%;
    top:2px;
    font-weight: bold;
    cursor: pointer;
  }
  .commentHeart:hover{
    color: #F63C33;
  }
  .heartActive{
    color: #F63C33;
  }
  .commentTips{
    text-align: center;
    padding: 10px 0;
  }
  .remarkOn{
    display: flex;
    padding: 0 50px;
    position: relative;
    margin-bottom: 60px;
  }
  .remarkOnavatar{
    border: 1px solid #ccc;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
  }
  .remarkOnavatar img{
    display: inline-block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .remarkOn textarea{
    width: 100%;
    height: 122px;
    resize: none;
    padding: 16px 20px;
    outline: 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #fff;
  }
  .remarkOn textarea:focus{
    border-color: #8492a6;
  }
  .remarkOn input{
    position: absolute;
    right: 60px;
    bottom: -45px;
    width: 100px;
    height: 35px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #41b883;
    color: #fff;
    border-radius: 4px;
  }
  .remarkOn input:hover{
    background-color: #006741;
  }
  .comentReply{
    padding-top: 10px;
    margin-bottom: 30px;
    position: relative;
    display: none;
  }
  .isEmerge{
    display: block;
  }
  .comentReply textarea{
    font-size: .875rem;
    width: 93%;
    padding: 16px 20px;
    height: 78px;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background-color: #fff;
    outline: 0;
    resize: none;
    color: #292525;
    font-weight: 400;
    line-height: 1.6;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    margin: 10px;
  }
  .comentReply textarea:focus{
    border-color: #8492a6;
  }
  .comentReply input{
    width: 75px;
    height: 30px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #41b883;
    color: #fff;
    border-radius: 4px;
    position: absolute;
    right: 10px;
  }
  .comentReply input:hover{
    background-color: #006741;
  }

</style>
