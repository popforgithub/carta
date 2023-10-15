<script setup lang="ts">
type Room = {
  id: string
  name: string
  isOpen: boolean
  cardSetId: string
  playerIds: Array<string>
  audienceIds: Array<string>
}

const props = defineProps<{
  isActive: boolean,
  room: Room | undefined
}>()
const emits = defineEmits<{
  (e: 'startMatch', v: Room): void
  (e: 'close'): void
}>()
const isActive = ref(false)
watch(() => props.isActive, () => {
  isActive.value = props.isActive
})
const startMatch = () => {
  emits('close')
  emits('startMatch', props.room)
}
const close = () => {
  emits('close')
}
</script>

<template>
  <v-dialog v-model="isActive" width="auto" @click:outside="close">
    <v-card >
      <v-card-text>
        現在入室中のメンバーで試合開始しますがよろしいですか？
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="はい" @click="startMatch"></v-btn>
        <v-spacer></v-spacer>
        <v-btn text="いいえ" @click="close"></v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
