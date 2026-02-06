<script>
  import Select from "svelte-select"

  let {
    value = $bindable(null),
    placeholder = "Search for a game...",
    onchange = () => {},
  } = $props()

  let items = $state([])
  let filterText = $state("")
  let loading = $state(false)
  let timer
  let debouncedVal = $state("")

  const debounce = (v) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedVal = v
    }, 750)
  }
  async function loadGames(search) {
    if (!search || search.length < 1) {
      items = []
      return
    }

    loading = true
    try {
      const response = await fetch(
        `/api/gamesigdb?search=${encodeURIComponent(search)}`,
      )
      if (response.ok) {
        const data = await response.json()
        // Format items to show vote count

        items = data.map((item) => ({
          value: item.id,
          label:
            item.name +
            " " +
            new Date(item.first_release_date * 1000).getFullYear(),
          slug: item.slug,
          year: new Date(item.first_release_date * 1000).getFullYear(),
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

  function handleChange(event) {
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
