export const domain = (url: string) => new URL(url).hostname.replace('www.', '')
