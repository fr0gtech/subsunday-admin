import { json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '../../../db';
import { game, vote } from '../../../db/schema';

export async function GET({ url }) {
    const fromId = url.searchParams.get('from') || '';
    const toId = url.searchParams.get('to') || '';
    
    console.log(fromId, toId);
    
    try {
        
        await db.update(vote).set({
            forId: toId
        })
        .where(
            eq(vote.forId, fromId)
        )
        await db.delete(game).where(eq(game.id, fromId))

        
        return json({status: "done"});
    } catch (error) {
        console.error('Database error:', error);
        return json({ error: 'Failed to fetch games' }, { status: 500 });
    }
}