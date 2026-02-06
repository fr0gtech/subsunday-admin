<script lang="ts">
  import { page } from "$app/stores"
  import GameSelect from "$components/gameSelect.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Card from "$lib/components/ui/card/index.js"
  import Input from "$lib/components/ui/input/input.svelte"
  let fromGame = $state<any>(null)
  let steamId = $state<any>(null)
  const mergeGame = async () => {
    if (!fromGame || !steamId) {
      throw new Error("did not select")
    }

    const baseUrl = new URL("/api/addSteamId", $page.url.origin)
    baseUrl.searchParams.set("game", fromGame.value)
    baseUrl.searchParams.set("steamId", steamId)

    await fetch(baseUrl.toString()).then((e) => console.log(e))
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Add Steam Id</Card.Title>
    <Card.Description>Add Steam Info to a game</Card.Description>
  </Card.Header>
  <Card.Content class="space-y-2">
    <!-- we keed two inputs with game auto complete and select? -->
    <div class="flex gap-5 w-full">
      <div class="w-1/2">
        <GameSelect bind:value={fromGame} />
        {#if fromGame}
          <div class="ml-4">
            <span>{fromGame?.label}</span>
            <img src={fromGame.picture} />
            <a
              target="_blank"
              class="text-sky-400"
              href={`https://sub-sunday.com/game/${fromGame.value}`}
              >subsunday</a
            >
          </div>
        {/if}
      </div>
      <div class=" whitespace-nowrap leading-[2.3]">
        {"-->"}
      </div>
      <div class="w-1/2">
        <Input
          bind:value={steamId}
          type="number"
          placeholder="steam id"
          class="max-w-xs"
        />
      </div>
    </div>
    {#if steamId && fromGame.value}
      <Button onclick={() => mergeGame()}>Merge</Button>
    {/if}
  </Card.Content>
</Card.Root>
<p>Session expiry: {$page.data.session?.expires}</p>
