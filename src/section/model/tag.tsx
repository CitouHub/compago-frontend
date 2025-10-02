export interface Tag {
    id: number,
    name: string,
    color: string
}

export const sortTagList = (tags: Tag[]) => {
    return tags
        .sort((tag1, tag2) => (tag1?.name ?? '')
        .localeCompare((tag2?.name ?? '')))
}