<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import { formatEther } from "ethers/lib/utils";
  import { signer, address, balance, networkName } from "./stores/wallet"
</script>

<ConnectWallet />

<!-- {#if $networkError}
  <p>
    To use this app, connect your wallet to <strong>
      {$networkError.want}
    </strong>
    <button on:click={connect}>Reconnect</button>
  </p>
{/if} -->

{#if $signer}
  <ul>
    <li>Address: {$address}</li>
    <li>Network: {$networkName}</li>
    {#if $balance}
      <li>Balance: {formatEther($balance)} Eth</li>
    {/if}
  </ul>
{/if}
