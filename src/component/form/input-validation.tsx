export const validateEmail = (email: string) => {
    return email === undefined || (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(email);
}

export const validatePhone = (phone: string) => {
    return phone === undefined || !(/[a-zA-Z]/).test(phone);
}