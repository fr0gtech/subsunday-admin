<script lang="ts">
  import { page } from "$app/stores"
  import { SignIn, SignOut } from "@auth/sveltekit/components"
  import ThemeSwitcher from "./themeSwitcher.svelte"
  import { Button } from "$lib/components/ui/button/index.js"
</script>

<header>
  <div class="flex justify-between w-full items-center">
    <div class="font-mono!">sub-sunday/admin</div>
    <div class=" flex gap-5 items-center">
      {#if $page.data.session}
        <span class="signedInText">
          {$page.data.session.user?.email ?? $page.data.session.user?.name}
        </span>
        <SignOut>
          <Button variant="outline">Sign out</Button>
        </SignOut>
      {:else}
        <span class="notSignedInText">You are not signed in</span>
        <SignIn>
          <Button variant="outline">Sign in</Button>
        </SignIn>
      {/if}
      <ThemeSwitcher />
    </div>
  </div>
  <nav>
    <ul class="navItems">
      <li class="navItem"><a href="/">Home</a></li>
      <li class="navItem"><a href="/addSteamId">Add Stream ID</a></li>

      <li class="navItem"><a href="/mergeGame">Merge Game</a></li>
      <li class="navItem"><a href="/matchigdbgame">match igdb Game</a></li>
    </ul>
  </nav>
</header>

<style>
  .nojs-show {
    opacity: 1;
    top: 0;
  }
  .signedInStatus {
    display: block;
    min-height: 4rem;
  }
  .loaded {
    position: relative;
    top: 0;
    opacity: 1;
    overflow: hidden;
    display: flex;
    align-items: center;
    border-radius: 0 0 0.6rem 0.6rem;
    padding: 0.6rem 1rem;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in;
  }
  .signedInText,
  .notSignedInText {
    justify-content: end;
    padding-left: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inherit;
    line-height: 1.3rem;
    flex: 1;
  }
  .signedInText {
    padding-top: 0rem;
    left: 4.6rem;
  }
  .avatar {
    border-radius: 2rem;
    float: left;
    height: 2.8rem;
    width: 2.8rem;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .buttonPrimary {
    font-weight: 500;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.4rem;
    position: relative;
    justify-self: end;
    background-color: #346df1;
    color: #fff;
    text-decoration: none;
    padding: 0.7rem 1.4rem;
  }
  .buttonPrimary:hover {
    box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.2);
  }
  .navItems {
    margin-bottom: 2rem;
    padding: 0;
    list-style: none;
  }
  .navItem {
    display: inline-block;
    margin-right: 1rem;
  }
  :global(form button) {
    border: none !important;
  }
</style>
