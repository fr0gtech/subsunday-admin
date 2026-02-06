import { db } from '../../../db';
import { game } from '../../../db/schema';
import { TZDate } from '@date-fns/tz';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
    const gameParam = parseInt(url.searchParams.get('game') as string)
    const steamIdParam = parseInt(url.searchParams.get('steamId') as string)

    const steamAppDetails = await getInfobyId(steamIdParam)
    const moreInfo = (steamAppDetails as any)[steamIdParam].data;

    const results = await db.update(game).set({
        name: moreInfo.name,
        picture: moreInfo.header_image || "",
        link: "",
        steamId: steamIdParam,
        description: moreInfo.short_description || "",
        website: moreInfo.website || "",
        dev: moreInfo.developers || [""],
        price: moreInfo.is_free ? { final: "free" } : moreInfo.price_overview || { final: "n/a" },
        categories: moreInfo.genres || {},
        recommendations: moreInfo.recommendations ? moreInfo.recommendations.total : 0,
        screenshots: moreInfo.screenshots,
        detailedDescription: JSON.stringify({ html: moreInfo.detailed_description }),
        movies: moreInfo.movies,
        createdAt: new TZDate(new Date(), env.TIMEZONE),
        updatedAt: new TZDate(new Date(), env.TIMEZONE),
    }).where(eq(game.id, gameParam)).returning()
    return json(results);

}

export async function getInfobyId(appId: number) {
    // when rebuilding votes this may hit a rate limit?
    const url = new URL("https://store.steampowered.com/api/appdetails")
    url.searchParams.set("appids", appId.toString());
    url.searchParams.set("cc", "us");
    const resp = await fetch(url.toString())

    // we can get rate limited or even banned... not sure if we get unbanned after a while...
    // if you are not sure if you are banned check: https://store.steampowered.com/
    if (resp.status === 429 || resp.status === 403) {
        // we hit steam rate limit wait for a bit and rerun self
        console.log("hit steam rate limit sleeping for 15000");
        await new Promise(resolve => setTimeout(resolve, 15000));
        return await getInfobyId(appId)
    } else if (resp.status !== 200) {
        console.log(resp);
    }
    const json = await resp.json()
    return json

}