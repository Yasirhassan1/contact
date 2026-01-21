export const isTokenAvalable = () => {
  if (typeof globalThis.window !== "undefined") {
    return !!localStorage.getItem("userToken");
  }
  return null;
};




export const getToken = ()=>{
    if (typeof globalThis.window !== "undefined") {
    return localStorage.getItem("userToken");
  }
}


export const writeTokenToLocalStorage = (token:string)=>{
  if (typeof globalThis.window !== "undefined") {
    localStorage.setItem("userToken", token);
  }

}

export const removeToken = ()=>{
     if (typeof globalThis.window !== "undefined") {
    localStorage.removeItem("userToken");
    
  }

}