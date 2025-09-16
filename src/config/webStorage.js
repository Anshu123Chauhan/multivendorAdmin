// webStorage.js
export const getCookie = (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };
  
  export const setCookie = (name, value, expirationTimeInSeconds) => {
    const expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + expirationTimeInSeconds * 1000);
    const tokenValue = value.startsWith("Bearer ") ? value : `Bearer ${value}`;
    document.cookie = `${name}=${tokenValue};expires=${expireDate.toUTCString()};path=/`;
  };
  
  export const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  };
  