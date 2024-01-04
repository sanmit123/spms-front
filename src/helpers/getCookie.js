// eslint-disable-next-line no-useless-escape
const token = document.cookie.replace(/(?:(?:^|.*;\s*)auth_token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

export { token }