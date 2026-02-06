import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types"
import { env } from "$env/dynamic/private";

export const load: LayoutServerLoad = async (event) => {
    if (!event.url.pathname.startsWith('/noaccess')) {
      const session = await event.locals.auth();
      if (session?.user?.email !== env.ADMIN_EMAIL) redirect(307, '/noaccess');
      return {
        session
      }
    }

}
