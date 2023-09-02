<script setup lang="ts">
const props = defineProps<{
  sessionUserName: Ref<string>
  wsConnections: Ref<number>
}>()
const sessionUserName = ref(props.sessionUserName)
const wsConnections = ref(props.wsConnections)

const emits = defineEmits<{
  (e: 'pageSelect', v: string): void
}>()

watch(() => props.wsConnections, () => {
  wsConnections.value = ref(props.wsConnections).value
})

const menuItems = ['PLAY', 'ROOM', 'CARTA', 'DB']
const drawer: Ref<boolean> = ref(false)
const openDrawer = () => {
  drawer.value = true
}

const pageSelect = (menuItem: string) => {
  emits('pageSelect', menuItem)
}
</script>

<template>
  <div>
    <header>
      <v-app-bar app dark>
        <v-app-bar-nav-icon id="nav-icon" @click="openDrawer()"></v-app-bar-nav-icon>
        <v-app-bar-title id="title">CARTA ONLINE</v-app-bar-title>
        <v-tabs id="v-tabs-for-pc" v-for="(menuItem, index) in menuItems" :key="index">
          <v-tab @click="pageSelect(menuItem)">
            {{ menuItem }}
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-layout id="ws-connections">
          <v-icon>mdi-monitor-cellphone</v-icon>
          <p >{{ wsConnections }}</p>
        </v-layout>
        <v-layout id="user-info" wrap>
          <v-icon>mdi-account</v-icon>
          <p> {{ sessionUserName }} さん</p>
        </v-layout>
      </v-app-bar>
      <v-navigation-drawer id="v-navigation-drawer-for-mobile" v-model="drawer" fixed temporary>
        <v-list nav dense>
          <v-list-item v-for="(menuItem, index) in menuItems" :key="index">
            <v-list-item-title>{{ menuItem }}</v-list-item-title>
          </v-list-item>
      </v-list>
      </v-navigation-drawer>
    </header>
    <div id="overlap-prevention"></div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/main';
#nav-icon {
  display: none;
  @include mobile {
    display: block;
  }
}
#title {
  max-width: 180px;
  min-width: 180px;
}
#v-tabs-for-pc {
  @include mobile {
    display: none;
  }
  .v-tab {
  margin-left: 15px;
  min-width: 60px;
}
}
#ws-connections {
  max-width: 50px;
  min-width: 50px;
}
#user-info {
  max-width: 180px;
}
#v-navigation-drawer-for-mobile {
  .v-list-item-title {
    text-align: center;
  }
}
#overlap-prevention {
  padding-bottom: 64px;
}
</style>
