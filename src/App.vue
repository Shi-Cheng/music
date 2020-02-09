<template>
  <div id="app" @touchmove.prevent>
    <music-header/>
    <music-tab/>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player/>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicHeader from './views/header'
import MusicTab from './views/tab'
import Player from './views/player/player'

export default {
  name: 'App',
  components: {
    Player,
    'music-header': MusicHeader,
    'music-tab': MusicTab
  }
}
</script>

<style>
#app {
  touch-action: none;
}
</style>
