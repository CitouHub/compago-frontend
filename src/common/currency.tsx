export enum Currency {
    Original,
    USD,
    EUR,
    SEK,
    DDK,
    NOK
}

export const currencies = Object.values(Currency)
    .filter((v) => !isNaN(Number(v))) as number[]