(()=>{const e=document.querySelector("video"),t=document.getElementById("play"),n=document.getElementById("mute"),d=(document.getElementById("time"),document.getElementById("volume")),u=document.getElementById("currentTime"),l=document.getElementById("totalTime"),i=document.getElementById("timeline"),o=document.getElementById("fullScreen"),m=document.getElementById("videoContainer"),r=document.getElementById("videoControls");let a=null,c=null,s=.5;e.volume=s;const v=n=>{e.paused?e.play():e.pause(),t.innerText=e.paused?"Play":"Pause"},E=t=>{e.muted?e.muted=!1:e.muted=!0,n.innerText=e.muted?"Unmute":"Mute",d.value=e.muted?0:s},T=e=>{const t=e>=3600?11:14;return new Date(1e3*e).toISOString().substring(t,19)},y=()=>r.classList.remove("showing");m.addEventListener("click",v),t.addEventListener("click",v),n.addEventListener("click",E),d.addEventListener("input",(t=>{const{target:{value:d}}=t;e.muted&&(e.muted=!1,n.innerText="Mute"),s=d,e.volume=d,n.innerText=0!==Number(s)?"Mute":"Unmute"})),e.addEventListener("timeupdate",(()=>{u.innerText=T(Math.floor(e.currentTime)),i.value=Math.floor(e.currentTime)})),e.addEventListener("loadedmetadata",(()=>{l.innerText=T(Math.floor(e.duration)),i.max=Math.floor(e.duration)})),e.addEventListener("ended",(()=>{const{id:e}=m.dataset;fetch("/api/videos/"+e+"/view",{method:"POST"})})),i.addEventListener("input",(t=>{const{target:{value:n}}=t;e.currentTime=n})),o.addEventListener("click",(()=>{document.fullscreenElement?(document.exitFullscreen(),o.innerText="Enter Full Screen"):(m.requestFullscreen(),o.innerText="Exit Full Screen")})),m.addEventListener("mousemove",(()=>{a&&(clearTimeout(a),a=null),c&&(clearTimeout(c),c=null),r.classList.add("showing"),c=setTimeout(y,3e3)})),m.addEventListener("mouseleave",(()=>{a=setTimeout(y,3e3)})),window.addEventListener("keydown",(e=>{32===e.keyCode&&v(),77===e.keyCode&&E()}))})();