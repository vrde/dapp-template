<script lang="ts">
  import { signer, web3Modal, disconnect } from "./stores/wallet"

  let error: string;

  async function handleConnect() {
    try {
      await web3Modal.openModal();
    } catch (e) {
      console.log("Error:", e);
      error = "Unable to connect your wallet.";
    }
  }

  async function handleDisconnect() {
    await disconnect();
  }
</script>

{#if $signer}
  <button on:click={handleDisconnect}>Disconnect wallet</button>
{:else}
  <w3m-core-button class="connect-wallet"></w3m-core-button>
  <button on:click={handleConnect}>Custom Connect Wallet</button>
  {#if error}
    <p>{error}</p>
  {/if}
{/if}

<style>
  .connect-wallet {
    display: block;
    margin-bottom: 10px;
  }
</style>