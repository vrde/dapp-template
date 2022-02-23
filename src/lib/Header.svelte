<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import { provider, address, balance, network } from "../stores/wallet";
  import { formatEther } from "ethers/lib/utils";
</script>

{#if $provider}
  <ul>
    <li>Address: {$address}</li>
    <li>Network: {$network}</li>
    {#if $balance}
      <li>Balance: {formatEther($balance)} Eth</li>
    {/if}
  </ul>
{:else}
  <ConnectWallet />
{/if}
