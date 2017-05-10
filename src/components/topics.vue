<template>
    <div class="topicsContent">
      <nav>
        <ul>
          <li><a :class="{'active': active_item === 'all' }" @click="select('all');cut('all')">全部</a></li>
          <li><a :class="{'active': active_item === 'hot' }" @click="select('hot');cut('good')">精华</a></li>
          <li><a :class="{'active': active_item === 'share' }" @click="select('share');cut('share')">分享</a></li>
          <li><a :class="{'active': active_item === 'question' }" @click="select('question');cut('ask')">问答</a></li>
          <li><a :class="{'active': active_item === 'hire' }" @click="select('hire');cut('job')">招聘</a></li>
        </ul>
      </nav>
      <div class="subject">
        <div class="article" v-for="topic in topicitems.data">
          <div class="article_left">
            <div class="avator">
              <img :title="topic.author.loginname" :src="topic.author.avatar_url">
            </div>
            <div class="count">
              <span class="reply_num" title="回复数" >{{topic.reply_count}}</span>&nbsp;/&nbsp;<span class="visit_num" title="点击数" >{{topic.visit_count}}</span>
            </div>
          </div>
          <div class="article_middle">
            <div class="tags">
              <span v-show="topic.top">置顶</span>
              <span v-show="topic.good">精华</span>
              <span v-show="topic.tab === 'share'">分享</span>
              <span v-show="topic.tab === 'ask'">回答</span>
              <span v-show="topic.tab === 'job'">招聘</span>
            </div>
            <div class="avator_title">
              <h2><router-link :to="{ path: 'detail', query: { id: topic.id}}" :title="topic.title">{{topic.title}}</router-link></h2>
            </div>
          </div>
          <div class="article_right">
            <div class="update">
              <span>{{topic.last_reply_at | replyTime}}</span>更新
            </div>
          </div>
        </div>
        <div class="pagination">
          <ul>
            <li><a @click="up(Tab)">上一页</a></li>
            <li><a @click="down(Tab)">下一页</a></li>
          </ul>
        </div>
      </div>
      <vtop></vtop>
    </div>
</template>

<script type="text/ecmascript-6">
    import NProgress from 'nprogress'
    import vtop from './backtop.vue'
    export default{
      data () {
        return {
          active_item: 'all',
          topicitems: '',
          pageNum: 1,
          Tab: 'all'
        }
      },
      components: { vtop },
      methods: {
        select (type) {
          this.active_item = type
        },
        cut (type) {
          NProgress.start()
          this.Tab = type
          this.pageNum = 1
          this.axios.get('http://cnodejs.org/api/v1/topics' + '?tab=' + type).then((response) => {
            this.topicitems = response.data
            NProgress.done()
          })
        },
        up (type) {
          NProgress.start()
          this.pageNum--
          let PageNumber = this.pageNum
          if (PageNumber <= 0) {
            this.$message({
              message: '已经是第一页了',
              type: 'warning'
            })
            this.pageNum = 1
            this.axios.get('http://cnodejs.org/api/v1/topics', {
              params: {
                page: 1,
                tab: type
              }
            }).then((response) => {
              this.topicitems = response.data
              NProgress.done()
            })
          } else {
            this.axios.get('http://cnodejs.org/api/v1/topics', {
              params: {
                page: PageNumber,
                tab: type
              }
            }).then((response) => {
              this.topicitems = response.data
              NProgress.done()
            })
          }
        },
        down (type) {
          NProgress.start()
          if (this.topicitems.data.length < 40) {
            this.$message({
              message: '已经是最后一页了',
              type: 'warning'
            })
            NProgress.done()
          } else {
            this.pageNum++
            let PageNumber = this.pageNum
            this.axios.get('http://cnodejs.org/api/v1/topics', {
              params: {
                page: PageNumber,
                tab: type
              }
            }).then((response) => {
              this.topicitems = response.data
              NProgress.done()
            })
          }
        }
      },
      created () {
        NProgress.start()
        this.axios.get('http://cnodejs.org/api/v1/topics').then((response) => {
          this.topicitems = response.data
          NProgress.done()
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
  nav ul{
    list-style: none;
    display: inline-block;
    width: 100%;
    padding: 0;
    border-bottom: 1px solid #ddd;
  }
  nav ul li{
    float: left;
    margin-right:30px ;
  }
  nav ul li a{
    display: inline-block;
    padding: 0 15px 10px;
    color: #333;
    font-weight: bold;
    font-size: 14px;
    border-bottom: 2px solid #FAFBFC;
    cursor: pointer;
  }
  nav ul li a:hover{
    border-bottom: 2px solid #41B883;
  }
  .active{
    border-bottom: 2px solid #41B883;
  }
  .article{
    border-bottom: 1px solid #F0F0F0;
    padding: 5px 10px;
    overflow: hidden;
    position: relative;
    margin-bottom: 15px;
  }
  .article>div{
    display: inline-block;
  }
  .article_left{
    float: left;
    text-align: center;
    width: 12%;
  }
  .avator{
    border: 1px solid #ccc;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 auto;
  }
  .avator img{
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .count{
    font-size: 12px;
    margin: 18px auto 0 ;
    font-weight: bold;
  }
  .reply_num{
    color: #41B883;
  }
  .article_middle{
    width: 76%;
  }
  .article_right{
    text-align: center;
    width: 12%;
    position: absolute;
    bottom: 10px;
    right: 5px;
    font-size: 12px;
  }
  .tags{
    font-size: 12px;
  }
  .tags>span{
    background: #41b883;
    color: #fff;
    padding: 2px 4px;
    border-radius: 2px;
  }
  .avator_title{
    font-size: 12px;
  }
  .avator_title h2{
    margin: 10px 0 0;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient: vertical;
  }
  .avator_title h2 a{
    color: #000;
  }
  .avator_title h2 a:hover{
    color: #41b883;
    text-decoration: underline;
  }
  .pagination{
    padding: 5px 0;
  }
  .pagination ul{
    list-style: none;
    display: flex;
    padding: 0 30px;
  }
  .pagination li{
    margin: 0 10px;
    width: 50%;
    text-align: center;
  }
  .pagination a{
    border: 1px solid #41b883;
    padding: 3px 6px;
    border-radius: 20px;
    cursor: pointer;
  }
  .pagination a:hover{
    border: none;
    background:#41b883 ;
    color: #fff;
  }
</style>

