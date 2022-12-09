<script lang="ts">
  import { signer, connect, disconnect } from "./stores/wallet"
</script>

{#if $signer}
  <button on:click={disconnect}>Disconnect wallet</button>
{:else}
  <w3m-core-button class="connect-wallet"></w3m-core-button>
  <button on:click={connect}>Custom Connect Wallet</button>
{/if}

<style>
  .connect-wallet {
    display: block;
    margin-bottom: 10px;
  }
</style>