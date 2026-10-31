import { THEME_KEY } from "./theme";

/**
 * Runs before first paint so a visitor on the day theme never sees a flash of
 * night. Kept as a string because it must execute before React hydrates.
 */
export const THEME_SCRIPT = `(function(){try{var m=localStorage.getItem(${JSON.stringify(
  THEME_KEY,
)})||"night";var d=new Date();var h=d.getHours()+d.getMinutes()/60;var n=m==="night"||(m==="auto"&&(h<6.5||h>=18.5));var r=document.documentElement;r.classList.toggle("dark",n);r.style.colorScheme=n?"dark":"light"}catch(e){}})();`;
