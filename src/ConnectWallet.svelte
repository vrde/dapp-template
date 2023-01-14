<script lang="ts">
  import { signer, connect, disconnect } from "./stores/wallet";
</script>

{#if $signer}
  <button on:click={disconnect}>Disconnect wallet</button>
{:else}
  <button on:click={connect}>Connect Wallet</button>
{/if}
