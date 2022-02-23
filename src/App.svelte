<script lang="ts">
  import Header from "./lib/Header.svelte";
  import SignMessage from "./lib/SignMessage.svelte";
  import { init, signer } from "./stores/wallet";

  const initializing = init();
</script>

{#await initializing}
  Loading
{:then}
  <Header />
  <main>
    {#if $signer}
      <SignMessage />
    {/if}
  </main>
{/await}
