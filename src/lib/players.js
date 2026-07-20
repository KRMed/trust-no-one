import { MODELS } from "./model"

const USERNAMES = [
    "astronoutcocoa",
    "redtomatojuice",
    "baconpureheart",
    "earthcowtongue"
];

// Allows the AI agents to have random usernames connected to their ID
export function createPlayers() {
    const players = [{ name: "[USER]", id: "human", model: null, state: true }];

    const randomNames = USERNAMES
        .map(val => ({ val, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ val }) => val)
    MODELS.forEach((bot, idx) => {
        players.push({ id: bot.id, name: randomNames[idx], model: bot.model, state: true})
    })

    return players;
}