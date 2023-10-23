<script setup lang="ts">
const createAllTables = async () => {
  await useFetch('/api/tables', { 
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

const deleteAllTables = async () => {
  await useFetch('/api/tables', { 
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
</script>

<template>
  <div class="container">
    <h1>開発用です。取扱注意</h1>
    <v-btn class="btn" @click="createAllTables">create All Tables</v-btn>
    <v-btn class="btn" @click="deleteAllTables">delete All Tables</v-btn>
  </div>
</template>

<style lang="scss" scoped>
</style>