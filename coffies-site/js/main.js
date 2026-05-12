/* main.js - Coffies shared UI */
document.addEventListener('DOMContentLoaded',()=>{
  const navbar=document.getElementById('navbar');
  if(navbar){window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60),{passive:true});}

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}});
  });

  const revEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if(revEls.length){
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('active'),i*80);obs.unobserve(e.target);}});
    },{threshold:0.12,rootMargin:'0px 0px -60px 0px'});
    revEls.forEach(el=>obs.observe(el));
  }

  const statEls=document.querySelectorAll('.stat-num[data-target]');
  if(statEls.length){
    const sObs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){
        const el=e.target,target=parseFloat(el.dataset.target);let cur=0;const step=target/60;
        const t=setInterval(()=>{cur=Math.min(cur+step,target);el.textContent=Math.round(cur);if(cur>=target)clearInterval(t);},25);
        sObs.unobserve(el);
      }});
    },{threshold:0.5});
    statEls.forEach(s=>sObs.observe(s));
  }

  if(window.matchMedia('(pointer:fine)').matches){
    const cur=document.createElement('div'),fol=document.createElement('div');
    cur.className='cursor';fol.className='cursor-follower';
    document.body.appendChild(cur);document.body.appendChild(fol);
    let mx=0,my=0,fx=0,fy=0;
    document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx-6+'px';cur.style.top=my-6+'px';});
    (function anim(){fx+=(mx-fx)*0.12;fy+=(my-fy)*0.12;fol.style.left=fx-18+'px';fol.style.top=fy-18+'px';requestAnimationFrame(anim);})();
    document.querySelectorAll('button,a,.product-card,.gal-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cur.style.transform='scale(2)';fol.style.transform='scale(1.5)';});
      el.addEventListener('mouseleave',()=>{cur.style.transform='scale(1)';fol.style.transform='scale(1)';});
    });
  }

  window.claimOffer=function(btn){
    const inp=document.getElementById('ctaEmail');if(!inp)return;
    if(inp.value.trim()&&/\S+@\S+\.\S+/.test(inp.value)){const o=btn.textContent;btn.textContent='🎉 Claimed!';inp.value='';setTimeout(()=>btn.textContent=o,3000);}
    else showToast('⚠️ Please enter a valid email');
  };
});