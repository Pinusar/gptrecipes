<script setup>
import { ref, reactive } from 'vue'
import {fetchDataFromAPI} from "@/services/gptService";
import Recipe from "@/components/Recipe.vue";
import getProductData from "@/services/foodDataService";

let rjson = {}

let shoppingData = {
  shoppingList: [],
  selverProducts: []
}

let apiKey = ref('')
let recipeKeyWords = ref('Italian cuisine')
let disableButton = ref(false)
let state = reactive({
  recipes: rjson,
  shoppingData,
  status: 'ready'
})

async function getRecipes() {
  disableButton.value = true
  state.status = 'Meisterkokk mõtleb retsepti...'
  let prompt = `Please generate me one recipe in JSON format using following ingredients ${recipeKeyWords.value}. Include the listed ingredients, but you can also add more items to get a tasty and interesting recipe. Here is the JSON format sample: {"recipeName": "Spinati ja fetaga täidetd kana", "ingredients": [{"item": "koostisosa a", "amount": "200 g"}], "instructions": ["Eelsoojenda ahi 190 kraadini"]}. Use metric system for measurement (grams and ml). Put them all in json array and dont provide any introduction. Your response must be valid json.`;
  let response = await fetchDataFromAPI(prompt, "");
  let message = response.choices[0].message.content;
  state.recipes = JSON.parse(message)

  state.status = 'Meisterkokk paneb ostunimekirja kokku...'
  let responseFormat = '{"shoppingList": [{"item": "sample item", "amount": "3 cups"}], "selverProducts": [{"productName": "tomatikaste", "url": "www.sampleurl.ee", "sku": "T000079918"}]}'
  let secondPrompt = `Can you make me a shopping list based on this recipe? The recipe is in json format: ${message}. And after that, could you find any products from this product list that would be useful for my shopping list? ONly use exact product names and url_key's that are in the attached product list. Try to find a counterpart in the products list for every product in the shopping list. If there is no good match, then skip this product. In your answer, please also provide links to the products, baseurl is https://www.selver.ee. Please provide answer in pure json format with following structure: ${responseFormat}. NB! Your response must be valid json! So no introduction text etc! The product list is here in json format: ${getProductData()}`
  let secondResponse = await fetchDataFromAPI(secondPrompt, "");
  let content = JSON.parse(secondResponse.choices[0].message.content);
  state.shoppingData.shoppingList = content.shoppingList;
  state.shoppingData.selverProducts = content.selverProducts;

  state.status = 'ready'
  disableButton.value = false
}
</script>

<template>
  <div>
    <h1>Retseptigeneraator</h1>

    <div v-if="state.status !== 'ready'">
      <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      <span>Palun oodake veidi... {{ state.status }} . See võib pisut aega võtta.</span>
    </div>
    <div v-else>
      <img alt="Chef picture" src="@/assets/chef.png" width="80" height="80" />
      <span>Sisestage paar koostisosa, genereerime nendega maitsva retsepti!</span>
    </div>

    <div class="container">
      <form>
        <div class="group">
          <input v-model="recipeKeyWords" type="text" required>
          <span class="highlight"></span>
          <span class="bar"></span>
          <label>Millest süüa teha soovid?</label>
        </div>
      </form>
    </div>

    <button :disabled="disableButton" class="button-5" role="button" @click="getRecipes">Otsi retsepte</button>

    <h1 v-if="state.recipes.recipes">Recipes</h1>

    <div v-for="recipe of state.recipes.recipes" :key="recipe.recipeName">
      <Recipe :instructions="recipe.instructions"
              :ingredients="recipe.ingredients"
              :recipeName="recipe.recipeName" />
    </div>

    <h1 v-if="state.shoppingData.shoppingList?.length > 0">Poenimekiri</h1>
    <ul>
      <li v-for="entry of state.shoppingData.shoppingList">{{ entry.item }} {{ entry.amount }}</li>
    </ul>

    <h1 v-if="state.shoppingData.selverProducts?.length > 0">Osta tooted mugavalt Selverist</h1>
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

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c85000;
  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 63px;
  left: 63px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  top: 68px;
  left: 56px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 71px;
  left: 48px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}
.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
}
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


/* input stuff */
* { box-sizing:border-box; }

/* basic stylings ------------------------------------------ */
.container    {
  font-family:'Roboto';
  width:600px;
  display:block;
  background:#FFF;
}
h2     {
  text-align:center;
  margin-bottom:50px;
}
h2 small {
  font-weight:normal;
  color:#888;
  display:block;
}
.footer   { text-align:center; }
.footer a  { color:#53B2C8; }

/* form starting stylings ------------------------------- */
.group        {
  position:relative;
  margin-bottom:45px;
}
input         {
  font-size:18px;
  padding:10px 10px 10px 5px;
  display:block;
  width:300px;
  border:none;
  border-bottom:1px solid #757575;
}
input:focus     { outline:none; }

/* LABEL ======================================= */
label          {
  color:#999;
  font-size:18px;
  font-weight:normal;
  position:absolute;
  pointer-events:none;
  left:5px;
  top:10px;
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
}

/* active state */
input:focus ~ label, input:valid ~ label    {
  top:-20px;
  font-size:14px;
  color:#5264AE;
}

/* BOTTOM BARS ================================= */
.bar  { position:relative; display:block; width:300px; }
.bar:before, .bar:after   {
  content:'';
  height:2px;
  width:0;
  bottom:1px;
  position:absolute;
  background:#5264AE;
  transition:0.2s ease all;
  -moz-transition:0.2s ease all;
  -webkit-transition:0.2s ease all;
}
.bar:before {
  left:50%;
}
.bar:after {
  right:50%;
}

/* active state */
input:focus ~ .bar:before, input:focus ~ .bar:after {
  width:50%;
}

/* HIGHLIGHTER ================================== */
.highlight {
  position:absolute;
  height:60%;
  width:100px;
  top:25%;
  left:0;
  pointer-events:none;
  opacity:0.5;
}

/* active state */
input:focus ~ .highlight {
  -webkit-animation:inputHighlighter 0.3s ease;
  -moz-animation:inputHighlighter 0.3s ease;
  animation:inputHighlighter 0.3s ease;
}

/* ANIMATIONS ================ */
@-webkit-keyframes inputHighlighter {
  from { background:#5264AE; }
  to  { width:0; background:transparent; }
}
@-moz-keyframes inputHighlighter {
  from { background:#5264AE; }
  to  { width:0; background:transparent; }
}
@keyframes inputHighlighter {
  from { background:#5264AE; }
  to  { width:0; background:transparent; }
}
</style>
