<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import {
    signer,
    address,
    balance,
    network,
    networkError,
  } from "./stores/wallet";
  import { formatEther } from "ethers/lib/utils";
</script>

<ConnectWallet />

{#if $networkError}
  <p>
    To use this app, connect your wallet to <strong>
      {$networkError.want}
    </strong>
  </p>
{/if}

{#if $signer}
  <ul>
    <li>Address: {$address}</li>
    <li>Network: {$network}</li>
    {#if $balance}
      <li>Balance: {formatEther($balance)} Eth</li>
    {/if}
  </ul>
{/if}
