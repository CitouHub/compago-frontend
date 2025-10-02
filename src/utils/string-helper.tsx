export function hashCode(text?: string | undefined) {
    var hash = 0, i, chr;
    if (text !== undefined && text.length > 0) {
        for (i = 0; i < text.length; i++) {
            chr = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
    }

    return hash;
}

export function getNumber(numberString?: string | undefined) {
    if (numberString !== undefined &&
        numberString as unknown as number !== undefined) {
        return Number(numberString)
    } else {
        return -1;
    }
}

export function encodeUrl(decodedUrl?: string | undefined) {
    return decodedUrl !== undefined ? decodedUrl.replaceAll("/", "|") : "";
}

export function decodeUrl(encodedUrl?: string | undefined) {
    return encodedUrl !== undefined ? encodedUrl.replaceAll("|", "/") : "";
}

export function isValidHttpUrl(value?: string) {
    if (value !== undefined) {
        let url;

        try {
            url = new URL(value);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    return false;
}