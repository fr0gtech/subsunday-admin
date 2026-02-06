export type TwitchToken = {
    access_token: string,
    expires_in: number,
    token_type: string,
}

export type GameFromSearch = {
    id: number,
    game: number,
    name: string
}
