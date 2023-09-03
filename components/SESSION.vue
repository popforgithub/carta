<script setup lang="ts">
import { ulid } from 'ulidx';

const emits = defineEmits<{
  (e: 'receiveSessionUser', v: {id: string, name: string}): void
}>()
const session = useCookie('session')
// session.value = null

const inputUserId: string = ''
const inputUserName: Ref<string> = ref('')
const sessionUser: Ref<{id: string, name: string}> = ref()

const findUserById = async (session) => {
  const { data: userResponse } = await useFetch('/api/users/:id',
    { 
      method: 'get',
      params: { id: session},
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return userResponse
}
if (session.value) {
  const response = await findUserById(session)
  sessionUser.value = {
    id: response.value.id,
    name: response.value.name
  }
  if (sessionUser.value.id !== 'notFoundById') { emits('receiveSessionUser', sessionUser.value) }
}

const createUser = async () => {
  if (inputUserName.value) {
    session.value = ulid()
    await useFetch('/api/users',
      { 
        method: 'post',
        body: { 
          id: session,
          name: inputUserName
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    sessionUser.value = {
      id: session.value,
      name: inputUserName.value
    }
    emits('receiveSessionUser', sessionUser.value)
  }
}

const deleteUser = async () => {
  await useFetch('/api/users/:id',
    { 
      method: 'delete',
      params: { id: inputUserId },
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}

const validateNum = value => !!value || 'お名前を1文字以上で入力してください'
</script>

<template>
  <div v-if="!session || sessionUser.id === 'notFoundById'">
    <v-text-field v-model="inputUserName" label="あなたの名前を入力してください" :rules="[validateNum]" />
    <v-btn @click="createUser">createUser</v-btn>
  </div>
</template>
