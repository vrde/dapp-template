<script lang="ts">
  import ConnectWallet from "./ConnectWallet.svelte";
  import { signer, address, balance, network } from "../stores/wallet";
  import { formatEther } from "ethers/lib/utils";
</script>

{#if $signer}
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
