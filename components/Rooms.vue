<script setup lang="ts">
const { data: roomList } = await useLazyFetch('/api/rooms',
  { 
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
</script>

<template>
  <v-app>
    <h1>component</h1>
    <v-list>
      <v-list-item v-for="(t, i) in roomList" :key="i">
        [id:{{ t.id }}] [name:{{ t.name }}] [isOpen:{{ t.isOpen }}] [userIds:{{ t.userIds }}]
      </v-list-item>
    </v-list>
  </v-app>
</template>