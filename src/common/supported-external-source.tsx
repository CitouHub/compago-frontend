export enum SupportedExternalSource {
    MicrosoftAzure,
    GSuite
}

export const supportedExternalSources = Object.values(SupportedExternalSource)
    .filter((v) => !isNaN(Number(v))) as number[]