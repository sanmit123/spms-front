const setTokenCookie = (token) => {
    const expiryDate = new Date();

    expiryDate.setDate(expiryDate.getDate() + 2);

    const cookieString = `auth_token=${token};expires=${expiryDate.toUTCString()};path=/`;

    document.cookie = cookieString;
};

export default setTokenCookie