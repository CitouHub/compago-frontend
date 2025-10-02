export enum Role {
    Admin = 1,
    User = 2,
    NoRole = 99
}

export const roles = Object.values(Role).filter((v) => !isNaN(Number(v))) as number[]