import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse, handleResponseNoContent } from "../../utils/api/response-handler";
import { User } from "../model/user";

export function login(username: string, password: string): Promise<User> {
    const requestOptions = {
        method: "POST",
        headers: {
            "username": `${username}`,
            "password": `${password}`,
            "Content-Type": "application/json"
        }
    };

    return fetch(`${import.meta.env.VITE_API_URL}/v1/login`, requestOptions)
        .then(response => {
            return handleResponse<User>(response)
        });
}

export function getUsers(): Promise<User[]> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/user/list`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<User[]>(response)
        });
}

export function getUser(userId: number): Promise<User> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/user/${userId}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<User>(response)
        });
}

export function addUser(user: User): Promise<User> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/user`, requestOptions(HttpMethod.POST, user))
        .then(response => {
            return handleResponse<User>(response)
        });
}

export function updateUser(user: User): Promise<User> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/user`, requestOptions(HttpMethod.PUT, user))
        .then(response => {
            return handleResponse<User>(response)
        });
}

export function deleteUser(userId: number): Promise<void> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/user/${userId}`, requestOptions(HttpMethod.DELETE))
        .then(response => {
            return handleResponseNoContent(response)
        });
}