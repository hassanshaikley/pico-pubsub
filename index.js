t=new EventTarget(),sub=(e,c)=>(t.addEventListener(e,c),_=>t.removeEventListener(e,c)),pub=(n,d)=>t.dispatchEvent(new CustomEvent(n,{detail:d}))
