<script lang="ts">
  import { page } from "$app/stores"
  import GameSelect from "$components/gameSelect.svelte"
  import Button from "$lib/components/ui/button/button.svelte"
  import * as Card from "$lib/components/ui/card/index.js"
  let fromGame = $state<any>(null)
  let toGame = $state<any>(null)

  const mergeGame = async () => {
    if (!fromGame || !toGame) {
      throw new Error("did not select")
    }
    if (fromGame.value === toGame.value) {
      throw new Error("cannot be the same game")
    }
    const baseUrl = new URL("/api/mergeGame", $page.url.origin)
    baseUrl.searchParams.set("from", fromGame.value)
    baseUrl.searchParams.set("to", toGame.value)

    await fetch(baseUrl.toString()).then((e) => console.log(e))
  }
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Merge game</Card.Title>
    <Card.Description>Merge one game to another</Card.Description>
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
        <GameSelect bind:value={toGame} />
        {#if toGame}
          <div class="ml-4">
            <span>{toGame?.label}</span>
            <img src={toGame.picture} />
            <a
              target="_blank"
              class="text-sky-400"
              href={`https://sub-sunday.com/game/${toGame.value}`}>subsunday</a
            >
          </div>
        {/if}
      </div>
    </div>
    <Button onclick={() => mergeGame()}>Merge</Button>
  </Card.Content>
</Card.Root>
<p>Session expiry: {$page.data.session?.expires}</p>
