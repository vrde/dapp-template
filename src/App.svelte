<script lang="ts">
  import Header from "./Header.svelte";
  import * as wallet from "./stores/wallet"
</script>

<header>
  <Header />
</header>
<main>hello</main>

<style>
  main {
    max-width: 1024px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
