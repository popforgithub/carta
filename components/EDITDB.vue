<script setup>
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
    <v-btn class="btn" @click="createAllTables">create All Tables</v-btn>
    <v-btn class="btn" @click="deleteAllTables">delete All Tables</v-btn>
  </div>
</template>

<style lang="scss" scoped>
</style>