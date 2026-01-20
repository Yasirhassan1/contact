export const isTokenAvalable = () => {
  if (typeof globalThis !== "undefined") {
    return !!localStorage.getItem("userToken");
  }
  return null;
};


export const writeTokenToLocalStorage = (token:string)=>{
  if (typeof globalThis !== "undefined") {
    localStorage.setItem("userToken", token);
  }

}

export const removeToken = ()=>{
     if (typeof globalThis !== "undefined") {
    localStorage.removeItem("userToken");
  }

}