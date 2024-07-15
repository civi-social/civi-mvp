export const hasOverlap = (arr1: string[], arr2: string[]): boolean => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return true;
    }
  }
  return false;
};

export const findOverlap = (arr1: string[], arr2: string[]): string | false => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr2.includes(arr1[i])) {
      return arr1[i];
    }
  }
  return false;
};

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
  cname: string,
  cvalue: string,
  exdays: number
) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  doc.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
