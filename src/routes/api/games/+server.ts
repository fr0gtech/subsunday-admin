import { json } from '@sveltejs/kit';
import { ilike, or, eq, sql, desc, and } from 'drizzle-orm';
import { db } from '../../../db';
import { game, vote } from '../../../db/schema';

export async function GET({ url }) {
    const search = url.searchParams.get('search') || '';
    const noinfo = url.searchParams.get('noinfo') || false
    console.log(noinfo);
    
    if (noinfo === "true") {
        try {
            const results = await db
                .select({
                    value: game.id,
                    label: game.name,
                    picture: game.picture,
                    voteCount: sql`COUNT(${vote.id})`.mapWith(Number)
                })
                .from(game)
                .leftJoin(vote, eq(vote.forId, game.id))
                .where(
                    and(
                        and(
                            eq(game.steamId, 0),
                            eq(game.igdbId, 0)
                        ),
                        or(
                            ilike(game.name, search),
                            ilike(game.name, `${search}%`)
                        )
                    )
                )
                .groupBy(game.id, game.name)
                .orderBy(desc(sql`COUNT(${vote.id})`))
                .limit(50);

            return json(results);
        } catch (error) {
            console.error('Database error:', error);
            return json({ error: 'Failed to fetch games' }, { status: 500 });
        }
    } else {
        try {
            const results = await db
                .select({
                    value: game.id,
                    label: game.name,
                    picture: game.picture,
                    voteCount: sql`COUNT(${vote.id})`.mapWith(Number)
                })
                .from(game)
                .leftJoin(vote, eq(vote.forId, game.id))
                .where(
                    or(
                        ilike(game.name, search),
                        ilike(game.name, `${search}%`)
                    )
                )
                .groupBy(game.id, game.name)
                .orderBy(desc(sql`COUNT(${vote.id})`))
                .limit(50);
            console.log(results);

            return json(results);
        } catch (error) {
            console.error('Database error:', error);
            return json({ error: 'Failed to fetch games' }, { status: 500 });
        }
    }
}