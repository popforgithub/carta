<script setup lang="ts">
const roomName = 'ROOM1'
const participants = ['参加者A', '参加者B', '参加者C', '参加者D']
</script>

<template>
  <v-app>
    <v-card class="mx-auto" width="35%" variant="outlined">
      <v-card-item>
        <div class="text-center">
          <div class="room-name text-h6 mb-1">
            {{ roomName }}
          </div>
          <v-list class="participants-list">
            <div class="participants" v-for="(t, i) in participants" :key="i">
              {{ t }}
            </div>
          </v-list>
        </div>
      </v-card-item>

      <v-card-actions class="border" style="display: flex; justify-content: space-around;">
        <v-btn variant="outlined">
          Enter
        </v-btn>
        <v-btn variant="outlined">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<style scoped lang="scss">
  .v-card {
    margin: 2%;
  }
  .participants-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap
  }
  .participants {
    color: red;
    padding: 3%;
  }
</style>