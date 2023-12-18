<script setup>
import { ref, reactive } from 'vue'
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
  let message = response.choices[0].message.content;
  state.recipes = JSON.parse(message)

  let responseFormat = '{"shoppingList": [{"item": "sample item", "amount": "3 cups"}], "selverProducts": [{"productName": "tomatikaste", "url": "www.sampleurl.ee"}]}'
  let secondPrompt = `Can you make me a unified shopping list based on these recipes? The recipes are in json format: ${message}. And after that, could you find any products from this product list that would be useful for my shopping list? In your answer, please also provide links to the products, baseurl is selver.ee. Please provide answer in pure json format with following structure: ${responseFormat}. Your response must be valid json. The product list is here in html format: ${getProductData()}`
  let secondResponse = await fetchDataFromAPI(secondPrompt, apiKey.value);
  let content = JSON.parse(secondResponse.choices[0].message.content);
  state.shoppingData.shoppingList = content.shoppingList;
  state.shoppingData.selverProducts = content.selverProducts;

}
</script>

<template>
  <div>
    <h1>Recipe app</h1>
    <label>Enter API key</label>
    <input type="password" v-model="apiKey">
    <button class="button-5" role="button" @click="getRecipes">Get recipes</button>

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

input {
  margin: 1em;
}

.button-5 {
  align-items: center;
  background-clip: padding-box;
  background-color: #cc033a;
  border: 1px solid transparent;
  border-radius: .25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: block;
  font-family: system-ui, -apple-system, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: auto;
}

.button-5:hover,
.button-5:focus {
  background-color: #fb8332;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
}

.button-5:hover {
  transform: translateY(-1px);
}

.button-5:active {
  background-color: #c85000;
  box-shadow: rgba(0, 0, 0, .06) 0 2px 4px;
  transform: translateY(0);
}
</style>