import { HttpMethod, requestOptions } from "../../utils/api/request-options";
import { handleResponse, handleResponseNoContent } from "../../utils/api/response-handler";
import { Tag } from "../model/tag";

export function getTags(): Promise<Tag[]> {
    return fetch(`${process.env.REACT_APP_API_URL}/tag/list`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Tag[]>(response)
        });
}

export function getTag(tagId: number): Promise<Tag> {
    return fetch(`${process.env.REACT_APP_API_URL}/tag/${tagId}`, requestOptions(HttpMethod.GET))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function addTag(tag: Tag): Promise<Tag> {
    return fetch(`${process.env.REACT_APP_API_URL}/tag`, requestOptions(HttpMethod.POST, tag))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function updateTag(tag: Tag): Promise<Tag> {
    return fetch(`${process.env.REACT_APP_API_URL}/tag`, requestOptions(HttpMethod.PUT, tag))
        .then(response => {
            return handleResponse<Tag>(response)
        });
}

export function deleteTag(tagId: number): Promise<void> {
    return fetch(`${process.env.REACT_APP_API_URL}/tag/${tagId}`, requestOptions(HttpMethod.DELETE))
        .then(response => {
            return handleResponseNoContent(response)
        });
}