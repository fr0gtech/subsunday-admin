<script lang="ts">
  import Select from "svelte-select"

  let {
    value = $bindable(null),
    placeholder = "Search for a game...",
    onchange = () => {},
    noInfo = false,
  } = $props()

  let items = $state<any>([])
  let filterText = $state("")
  let loading = $state(false)
  let timer: any
  let debouncedVal = $state("")

  const debounce = (v: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedVal = v
    }, 750)
  }
  async function loadGames(search: any) {
    if (!search || search.length < 1) {
      items = []
      return
    }

    loading = true
    try {
      const response = await fetch(
        `/api/games?search=${encodeURIComponent(search)}&noinfo=${noInfo}`,
      )
      if (response.ok) {
        const data = await response.json()
        // Format items to show vote count
        items = data.map((item: any) => ({
          value: item.value,
          label: `${item.label} (${item.voteCount} ${item.voteCount === 1 ? "vote" : "votes"})`,
          voteCount: item.voteCount,
          originalLabel: item.label,
          picture: item.picture,
        }))
      }
    } catch (error) {
      console.error("Failed to load games:", error)
      items = []
    } finally {
      loading = false
    }
  }

  $effect(() => {
    loadGames(debouncedVal)
  })

  $effect(() => {
    if (filterText !== undefined && filterText !== "") {
      debounce(filterText)
      // debouncedSearch(filterText)
    }
  })

  function handleChange(event: any) {
    onchange(event.detail)
  }
</script>

<Select
  {items}
  {placeholder}
  {loading}
  bind:filterText
  bind:value
  on:change={handleChange}
/>
