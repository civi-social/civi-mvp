//  https://www.w3schools.com/js/js_cookies.asp
export function getCookieFromString(cookieString: string, cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(cookieString);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// https://www.w3schools.com/js/js_cookies.asp
export function setCookieInDom(
  doc: typeof document,
  cookieName: string,
  cookieValue: string,
  expirationDays: number | "DELETE"
) {
  let expires = "";
  if (expirationDays === "DELETE") {
    expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT";
  } else {
    const d = new Date();
    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    expires = "expires=" + d.toUTCString();
  }
  doc.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

export const useCookies = (doc: typeof document) => {
  return {
    set: (cookieName: string, cookieValue: string) =>
      setCookieInDom(doc, cookieName, cookieValue, 10065),
    delete: (cookieName: string) =>
      setCookieInDom(doc, cookieName, "", "DELETE"),
  };
};
