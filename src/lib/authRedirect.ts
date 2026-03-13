const AUTH_REDIRECT_KEY = "queenkoba-auth-redirect";

export const setAuthRedirect = (path: string) => {
  sessionStorage.setItem(AUTH_REDIRECT_KEY, path);
};

export const getAuthRedirect = () => sessionStorage.getItem(AUTH_REDIRECT_KEY);

export const consumeAuthRedirect = () => {
  const path = getAuthRedirect();

  if (path) {
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
  }

  return path;
};
