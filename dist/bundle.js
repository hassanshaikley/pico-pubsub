(()=>{var n=new EventTarget,v={s:(e,t)=>(n.addEventListener(e,t),()=>n.removeEventListener(e,t)),p:(e,t)=>n.dispatchEvent(new CustomEvent(e,{detail:t}))};})();
