import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { game, vote } from '../../../db/schema';
import type { GameIGDB } from '../../../db/types';
import { env } from '$env/dynamic/private';
import { IGDBreq, IGDBToGameForDb, initIGDB } from '$lib/server/serverUtils';

export async function GET({ url }) {
    const update = parseInt(url.searchParams.get('update') as string) 
    const toId = url.searchParams.get('igdb') || '';
    
    try {
        await initIGDB()
        const gameFound = await IGDBreq<GameIGDB[]>('games',
            `fields name,websites.url,websites.type,screenshots.url,genres.name,videos.video_id,cover.url,summary,storyline,artworks.url,game_status;
            where id = ${toId};`
        )
        if ([6,7,8].includes(gameFound[0]?.game_status as number)){
            // game is rumored, delisted or cancelled
            return json({ error: 'Failed to fetch games' }, { status: 500 });
        }

        const gameMap = {...gameFound[0], websites: gameFound[0]?.websites?.sort((a,b) => a.type - b.type)} as GameIGDB
        // get igdb info
        const data: any = IGDBToGameForDb(gameMap, env.TIMEZONE)
        // build info object

        // update it

        await db.update(game).set(data)
        .where(
            eq(game.id, update)
        )

        
        return json({status: "done"});
    } catch (error) {
        console.error('Database error:', error);
        return json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}