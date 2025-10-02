export function getGridState<T>(stateKey: string): T {
    const stateData: string | null = localStorage.getItem(stateKey);
    if (stateData !== undefined && stateData !== null && stateData !== "undefined") {
        const savedState: T = JSON.parse(stateData);
        return savedState
    }

    return {} as T;
}