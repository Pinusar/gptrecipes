<script setup>
import { ref, reactive, computed } from 'vue'
import {fetchDataFromAPI} from "@/services/gptService";
import Recipe from "@/components/Recipe.vue";
import getProductData from "@/services/foodDataService";

let rjson = [{
  recipeName: "Sample recipe",
  ingredients: [
    "Sample ingredient",
  ],
  instructions: [
    "Sample instruction",
  ]
}]

let shoppingData = {
  shoppingList: [{item: "sample item", amount: "3 cups"}],
  selverProducts: [{productName: "tomatikaste", url: "www.sampleurl.ee"}]
}

let apiKey = ref('')
let state = reactive({
  recipes: rjson,
  shoppingData
})

async function getRecipes() {
  let prompt = 'Please generate me 3 recipes in JSON format. Here is the JSON format sample: {"recipeName": "Spinach and Feta Stuffed Chicken", "ingredients": [{"item": "ingredient a", "amount": "2 cups"}], "instructions": ["Preheat the oven to 375 degrees F (190 degrees C)."]}. Put them all in json array and dont provide any introduction. Your response must be valid json.';
  let response = await fetchDataFromAPI(prompt, apiKey.value);
  console.log(response)
  let message = response.choices[0].message.content;
  state.recipes = JSON.parse(message)

  let responseFormat = '{"shoppingList": [{"item": "sample item", "amount": "3 cups"}], "selverProducts": [{"productName": "tomatikaste", "url": "www.sampleurl.ee"}]}'
  let secondPrompt = `Can you make me a unified shopping list based on these recipes? The recipes are in json format: ${message}. And after that, could you find any products from this product list that would be useful for my shopping list? In your answer, please also provide links to the products, baseurl is selver.ee. Please provide answer in pure json format with following structure: ${responseFormat}. The product list is here in html format: ${getProductData()}`
  let secondResponse = await fetchDataFromAPI(secondPrompt, apiKey.value);
  let content = secondResponse.choices[0].message.content;
  state.shoppingData.shoppingList = content.shoppingList;
  state.shoppingData.selverProducts = content.selverProducts;
  console.log(content)

}
</script>

<template>
  <div>
    <h1>Recipe app</h1>
    <input type="text" v-model="apiKey">
    <p>Your api key:
      <span>{{apiKey}}</span>
    </p>
    <button @click="getRecipes">Get recipes</button>

    <div v-for="recipe of state.recipes" :key="recipe.recipeName">
      <Recipe :instructions="recipe.instructions"
              :ingredients="recipe.ingredients"
              :recipeName="recipe.recipeName" />
    </div>

    <h1>Shopping List</h1>
    <ul>
      <li v-for="entry of state.shoppingData.shoppingList">{{ entry.item }} {{ entry.amount }}</li>
    </ul>

    <h1>Get the products from Selver</h1>
    <ul>
      <li v-for="entry of state.shoppingData.selverProducts"> {{ entry.productName }} ( <a :href="entry.url">{{ entry.url }}</a> ) </li>
    </ul>
  </div>
</template>

<style scoped>

</style>