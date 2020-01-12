<template>
  <div id="app" @touchmove.prevent>
    <music-header/>
    <music-tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicHeader from './views/header'
import MusicTab from './views/tab'
export default {
  name: 'App',
  components: {
    'music-header': MusicHeader,
    'music-tab': MusicTab
  }
}
</script>

<style>
#app {

}
</style>
