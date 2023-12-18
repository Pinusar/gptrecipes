<script setup>
import HelloWorld from './components/HelloWorld.vue'
import RecipeApp from "@/components/RecipeApp.vue";
</script>

<template>
  <header>
    <img alt="Shop logo" class="logo" src="./assets/Selver_logo.svg.png" width="200" height="200" />

    <div class="wrapper">
      <HelloWorld msg="Looking for recipe ideas?" />
    </div>
  </header>

  <main>
    <RecipeApp />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
