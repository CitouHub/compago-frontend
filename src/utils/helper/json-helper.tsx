export function dateTimeReviver(key: string, value: string) {
    const dateDetect = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    if (dateDetect.exec(value)) {
        return new Date(Date.parse(value));
    }

    return value;
}