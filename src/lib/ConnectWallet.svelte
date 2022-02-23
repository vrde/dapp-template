<script lang="ts">
  import { connect } from "../stores/wallet";

  let error: string;

  async function handleConnect() {
    try {
      await connect();
    } catch (e) {
      console.log("Error:", e);
      error = "Unable to connect your wallet.";
    }
  }
</script>

<button on:click={handleConnect}>Connect wallet</button>
{#if error}
  <p>{error}</p>
{/if}
