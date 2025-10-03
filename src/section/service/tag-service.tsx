import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse, handleResponseNoContent } from "../../utils/api/response-handler";
import { Tag } from "../model/tag";

export function getTags(): Promise<Tag[]> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/tag/list`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Tag[]>(response)
        });
}

export function getTag(tagId: number): Promise<Tag> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/tag/${tagId}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function addTag(tag: Tag): Promise<Tag> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/tag`, requestOptions(HttpMethod.POST, tag))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function updateTag(tag: Tag): Promise<Tag> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/tag`, requestOptions(HttpMethod.PUT, tag))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function deleteTag(tagId: number): Promise<void> {
    return fetch(`${import.meta.env.VITE_API_URL}/v1/tag/${tagId}`, requestOptions(HttpMethod.DELETE))
        .then(response => {
            return handleResponseNoContent(response)
        });
}