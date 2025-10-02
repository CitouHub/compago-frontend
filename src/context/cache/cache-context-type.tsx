export interface CacheContextType {
    keys: Record<string, string | undefined>,
    update: (...items: { key: string, value?: string | undefined }[]) => void
    remove: (key: string) => void
};