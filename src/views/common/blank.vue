<template>
  <div></div>
    <ul class="noqLengthUl">
        <span class="navBg" ref="noNavBg"></span>
        <li v-for="(item, index) in noqtab" :key="item.id" :class="{active: index == nowIndex}"
            @click="changeTab($event, index)" @mouseenter="changeBgPos($event, index)" @mouseleave="backBgPos($event, index)">
            <a href="javascript:;">{{item.value}}</a>
        </li> :class="{active: index == nowIndex}" 
    </ul>

</template>

<script>
export default {
  name: "blank",
  created() {
    this.$store.dispatch('getNavList')
    localStorage.setItem('SET_NAV_ACTIVE', -1)
    
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
