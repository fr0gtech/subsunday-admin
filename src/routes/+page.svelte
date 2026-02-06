<script lang="ts">
  import { page } from "$app/stores"
  import GameSelect from "$components/gameSelect.svelte"
  import * as Card from "$lib/components/ui/card/index.js"
  let selectedGame = $state(null);


</script>

{#if $page.data.session}
  <p>Session expiry: {$page.data.session?.expires}</p>
{:else}
  <h1>Access Denied</h1>
{/if}
