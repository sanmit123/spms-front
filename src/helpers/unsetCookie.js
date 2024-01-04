const unsetTokenCookie = () => {
    document.cookie = 'auth_token=;';
};

export default unsetTokenCookie