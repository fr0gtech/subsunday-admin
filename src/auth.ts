import { SvelteKitAuth } from "@auth/sveltekit"

import Twitch from "@auth/sveltekit/providers/twitch"


export const { handle, signIn, signOut } = SvelteKitAuth({
  trustHost: true,
  providers: [
    Twitch,
  ],
})
