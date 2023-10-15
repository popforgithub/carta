<script setup lang="ts">
const props = defineProps<{
  penaltyDialog: Ref<boolean>
}>()

const overlaySettings = {
  overlay: true, // スクリムを表示
  zIndex: 10, // スクリムのZインデックス
  clickToClose: false, // スクリムのクリックを無効化
}
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="props.penaltyDialog.value" persistent width="auto" :overlay="overlaySettings">
      <v-card>
        <v-card-text>
          おてつきです。このターンはもうだめです。リロードしてもだめです。
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
