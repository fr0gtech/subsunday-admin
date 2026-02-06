import { json } from '@sveltejs/kit';
import type { GameFromSearch } from '$lib/types';
import { IGDBreq, initIGDB } from '$lib/server/serverUtils';




export async function GET({ url }) {
    await initIGDB()
    const search = url.searchParams.get('search') || '';
    try {
        // do api request to igdb search
        const gameSearchRaw = await IGDBreq<GameFromSearch[]>('games', `search "${search}"; fields name,slug,first_release_date;limit 10;`)
        console.log(gameSearchRaw);
        
        // build a link from this would need slug
        return json(gameSearchRaw);
    } catch (error) {
        console.error('Database error:', error);
        return json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}


