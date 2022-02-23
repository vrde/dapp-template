<script lang="ts">
  import { onMount } from "svelte";

  import Header from "./lib/Header.svelte";
  import SignMessage from "./lib/SignMessage.svelte";
  import { init, signer } from "./stores/wallet";

  onMount(async () => {
    await init();
  });
</script>

<Header />
<main>
  {#if $signer}
    <SignMessage />
  {/if}
</main>
