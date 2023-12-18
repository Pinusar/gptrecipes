<script setup>
defineProps({
  recipeName: {
    type: String,
    required: true
  },
  ingredients: {
    type: Array,
    required: true
  },
  instructions: {
    type: Array,
    required: true
  },
})
</script>

<template>
  <h2>{{ recipeName }}</h2>
  <ul>
    <li v-for="ingredient of ingredients">{{ ingredient.item }} {{ ingredient.amount }}</li>
  </ul>
  <p v-for="instruction of instructions">{{ instruction }}</p>
</template>

<style scoped>

</style>