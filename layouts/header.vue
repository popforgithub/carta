<script setup lang="ts">
const menuItems = [
    {
      name: 'カルタで遊ぶ',
      url: '#'
    },
    {
      name: 'カルタを作る',
      url: '#'
    },
    {
      name: 'データベース編集',
      url: '#'
    }
  ]
const wsConnections = 15
const userName = 'defaultUser'
const drawer: Ref<boolean> = ref(false)

const openDrawer = () => {
  drawer.value = true
}
</script>

<template>
  <v-app>
    <header>
      <v-app-bar app dark>
        <v-app-bar-nav-icon id="nav-icon" @click="openDrawer()"></v-app-bar-nav-icon>
        <v-app-bar-title id="title">CARTA ONLINE</v-app-bar-title>
        <v-tabs>
          <v-tab v-for="(menuItem, index) in menuItems" :key="index">
            {{ menuItem.name }}
          </v-tab>
        </v-tabs>
        <v-spacer></v-spacer>
        <v-layout id="ws-connections">
          <v-icon>mdi-monitor-cellphone</v-icon>
          <p>{{ wsConnections }}</p>
        </v-layout>
        <v-layout id="user-info" wrap>
          <v-icon>mdi-account</v-icon>
          <p> {{ userName }} さん</p>
        </v-layout>
      </v-app-bar>
      <v-navigation-drawer v-model="drawer" fixed temporary>
        <v-list nav dense>
          <v-list-item-group>
            <v-list-item v-for="(menuItem, index) in menuItems" :key="index">
              <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </header>
    <slot />
  </v-app>
</template>

<style lang="scss" scoped>
#title {
  max-width: 175px;
  min-width: 175px;
  background-color: red;
  @include mobile {
    background-color: yellow;
  }
}
#ws-connections {
  max-width: 70px;
  min-width: 70px;
}
#user-info {
  max-width: 200px;
  min-width: 200px;
}
</style>
