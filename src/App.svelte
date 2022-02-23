<script lang="ts">
  import Header from "./lib/Header.svelte";
  import SignMessage from "./lib/SignMessage.svelte";
  import { signer } from "./stores/wallet";
</script>

<Header />
<main>
  {#if $signer}
    <SignMessage />
  {/if}
</main>
