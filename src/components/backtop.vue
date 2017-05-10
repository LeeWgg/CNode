<template>
  <div class="backTop"  v-show="isShow" @click="goTop">
    回到顶部
  </div>
</template>

<script type="text/ecmascript-6">
    import $ from 'jquery'
    export default{
      data () {
        return {
          isShow: false
        }
      },
      methods: {
        goTop () {
          $('html,body').animate({scrollTop: 0}, 500)
          // this.isShow = false
        }
      },
      mounted () {
        $(window).on('scroll', () => {
          if ($(window).scrollTop() > 300) {
            this.isShow = true
          } else {
            this.isShow = false
          }
        })
      },
      beforeDestroy () {
        $(window).off('scroll')
      }
    }
</script>

<style lang="css" scoped>
.backTop{
  color: #41B883;
  position: fixed;
  right: 0;
  bottom: 200px;
  background: #fff;
  width: 25px;
  padding: 10px 5px 10px 5px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(46,61,73,.08);
  border: 1px solid #dbe2e8;
  border-right: none;
  -moz-border-radius-topleft: 4px;
  -moz-border-radius-bottomleft: 4px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  z-index: 666;
}
</style>
