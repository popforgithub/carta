<script setup lang="ts">
const roomName = 'ROOM1'
const participants = ['参加者A', '参加者B', '参加者C', '参加者D']
</script>

<template>
  <v-card class="mx-auto" variant="outlined">
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
        参加
      </v-btn>
      <v-btn variant="outlined">
        観戦
      </v-btn>
      <v-btn variant="outlined">
        削除
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss">
@import '@/assets/main';
.v-card {
  margin: 2%;
  width: 40%;
  @include mobile {
    width: 80%;
  }
}
  .participants-list {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap
  }
  .participants {
    color: red;
    padding: 0 2%;
  }
</style>