<script lang="ts">
  import "../app.css"
  import { ModeWatcher } from "mode-watcher"
  import Header from "$components/header.svelte"
  import Footer from "$components/footer.svelte"
</script>

<ModeWatcher />
<div class="mx-auto max-w-screen-xl grow gap-5 space-y-5 leading-relaxed mt-5">
  <Header />
  <slot />
  <!-- <Footer /> -->
</div>
