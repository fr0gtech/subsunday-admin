
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { GameIGDB, TwitchToken } from "../../db/types";
import { TZDate } from "@date-fns/tz";
import { env } from "$env/dynamic/private";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export let headers: any
export let method = 'POST'
let token: TwitchToken;

export const IGDBreq = async <T>(route: string, query: string): Promise<T> => {
  return fetch(
    `https://api.igdb.com/v4/${route}`,
    {
      method,
      headers,
      body: query
    }
  ).then((res) => res.json()) as T;
};
export const initIGDB = async () => {
  token = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${env.AUTH_TWITCH_ID}&client_secret=${env.AUTH_TWITCH_SECRET}&grant_type=client_credentials`,
    {
      method: "POST"
    }
  ).then((e) => e.json()) as TwitchToken;
  
  if (!headers) {
    headers = {
      'Accept': 'application/json',
      'Client-ID': env.AUTH_TWITCH_ID as string,
      'Authorization': `Bearer ${token.access_token}`,
    };
  }
};
export const IGDBToGameForDb = (gameIGDB: GameIGDB, timezone: string) => {
    const pic = gameIGDB.artworks && gameIGDB.artworks[0] ? gameIGDB.artworks[0].url.replace("t_thumb", "t_720p")
                    :
                    gameIGDB.cover ? gameIGDB.cover.url.replace("t_thumb", "t_720p") : ""
    return {
        name: gameIGDB.name,
        picture: pic,
        link: "",
        steamId: 0,
        description: gameIGDB.summary || "",
        website: gameIGDB.websites ? gameIGDB.websites[0]?.url : "",
        dev: [""],
        price: { final: "n/a" },
        categories: gameIGDB.genres ? gameIGDB.genres.map((e)=>{
            return{
                "id": e.id,
                "description": e.name
            }
        }) : [],
        recommendations: 0,
        // https://api-docs.igdb.com/?javascript#images
        screenshots: gameIGDB.screenshots ? gameIGDB.screenshots.map((e)=>{
            return {
                "id": e.id,
                "path_full": e.url.replace("t_thumb", "t_720p"),
                "path_thumbnail": e.url.replace("t_thumb", "t_screenshot_med")
            }
        }) : "",
        detailedDescription: gameIGDB.storyline || gameIGDB.summary,
        movies: gameIGDB.videos ? gameIGDB.videos.map((e)=>e.video_id) : [],
        createdAt: new TZDate(new Date(), env.TIMEZONE),
        updatedAt: new TZDate(new Date(), env.TIMEZONE),
        igdbId: gameIGDB.id
    }
}

