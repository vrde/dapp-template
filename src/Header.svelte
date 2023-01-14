<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import { formatEther } from "ethers/lib/utils";
  import {
    signer,
    address,
    balance,
    networkName,
    networkError,
    connect,
  } from "./stores/wallet";
</script>

<ConnectWallet />

{#if $networkError}
  <p>
    To use this app, disconnect from <strong>{$networkError.got}</strong>
    and reconnect your wallet to <strong>{$networkError.want}</strong>
    <br />
    <button on:click={connect}>Reconnect</button>
  </p>
{/if}

{#if $signer}
  <ul>
    <li>Address: {$address}</li>
    <li>Network: {$networkName}</li>
    {#if $balance}
      <li>Balance: {formatEther($balance)} Eth</li>
    {/if}
  </ul>
{/if}
