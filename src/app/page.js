"use client";

import { useEffect } from "react";

const STYLE = `
/* ═══════════════════════════════════════════
   DESIGN TOKENS
   Palette: Pergamino · Selva · Terracota · Oro
   Type: Cormorant Garamond (display) · Plus Jakarta Sans (body)
   Signature: Grain texture + marquee + staggered hero
═══════════════════════════════════════════ */
:root {
  --display: 'Cormorant Garamond', Georgia, serif;
  --body:    'Plus Jakarta Sans', system-ui, sans-serif;

  /* Palette */
  --ink:       #1B1409;
  --parch:     #F3EEE4;
  --surf:      #F9F7F2;
  --selva:     #1C3B28;
  --verde:     #7CB689;
  --verde-lt:  #A8D6B0;
  --terra:     #DE6A3E;
  --oro:       #DCB24A;
  --fog:       rgba(27,20,9,.07);

  /* Type scale */
  --t-2xs: clamp(.65rem,  .62rem + .15vw, .75rem);
  --t-xs:  clamp(.75rem,  .7rem  + .25vw, .875rem);
  --t-sm:  clamp(.875rem, .82rem + .275vw,1rem);
  --t-md:  clamp(1rem,    .95rem + .25vw, 1.125rem);
  --t-lg:  clamp(1.15rem, 1rem   + .75vw, 1.6rem);
  --t-xl:  clamp(1.5rem,  1.1rem + 2vw,   3rem);
  --t-2xl: clamp(2rem,    1.2rem + 4vw,   5.5rem);
  --t-hero:clamp(3.5rem,  .5rem  + 9vw,   9.5rem);

  /* Spacing */
  --s1:.25rem; --s2:.5rem;  --s3:.75rem; --s4:1rem;
  --s5:1.25rem;--s6:1.5rem; --s8:2rem;   --s10:2.5rem;
  --s12:3rem;  --s16:4rem;  --s20:5rem;  --s24:6rem;

  /* Misc */
  --r-sm:.375rem; --r-md:.625rem; --r-lg:1rem; --r-xl:1.5rem; --r-full:9999px;
  --ease: cubic-bezier(.16,1,.3,1);
  --ease-out: cubic-bezier(0,0,.3,1);
  --dur:240ms; --dur-lg:520ms;
  --sh-sm: 0 1px 4px rgba(27,20,9,.06),0 4px 16px rgba(27,20,9,.05);
  --sh-md: 0 4px 16px rgba(27,20,9,.09),0 12px 40px rgba(27,20,9,.07);
  --sh-lg: 0 8px 32px rgba(27,20,9,.12),0 32px 80px rgba(27,20,9,.10);
  --max:1280px;
  --hh:68px;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:var(--hh);-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
body{font-family:var(--body);background:var(--parch);color:var(--ink);min-height:100dvh;overflow-x:hidden;line-height:1.65}
img{display:block;max-width:100%;height:auto}
ul{list-style:none}
a{text-decoration:none;color:inherit}
button{cursor:pointer;background:none;border:none;font:inherit;color:inherit}
h1,h2,h3,h4{text-wrap:balance;line-height:1.1}
p{text-wrap:pretty}
::selection{background:rgba(58,107,71,.18)}
:focus-visible{outline:2px solid var(--verde);outline-offset:3px;border-radius:var(--r-sm)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}

/* ─── GRAIN TEXTURE ─── */
body::after{
  content:'';position:fixed;inset:-200px;
  width:calc(100% + 400px);height:calc(100% + 400px);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity:.028;pointer-events:none;z-index:9000;
  animation:grain-shift 7s steps(9) infinite;
}
@keyframes grain-shift{
  0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-1%)}
  20%{transform:translate(2%,1%)}30%{transform:translate(-1%,2%)}
  40%{transform:translate(1%,-2%)}50%{transform:translate(-2%,1%)}
  60%{transform:translate(2%,-1%)}70%{transform:translate(-1%,-2%)}
  80%{transform:translate(1%,2%)}90%{transform:translate(-2%,2%)}
}

/* ─── PROGRESS BAR ─── */
#prog{position:fixed;top:0;left:0;z-index:9999;height:2px;width:0;
  background:linear-gradient(90deg,var(--verde),var(--terra),var(--oro));
  transition:width .08s linear;border-radius:0 var(--r-full) var(--r-full) 0;
}

/* ─── CUSTOM CURSOR (desktop) ─── */
@media(hover:hover) and (pointer:fine){
  body{cursor:none}
  a,button{cursor:none}
  #cdot{position:fixed;top:0;left:0;width:8px;height:8px;
    background:var(--verde);border-radius:50%;
    transform:translate(-50%,-50%);pointer-events:none;z-index:9998;
    transition:width .2s var(--ease),height .2s var(--ease),background .2s,opacity .2s;
  }
  #cring{position:fixed;top:0;left:0;width:34px;height:34px;
    border:1.5px solid var(--verde);border-radius:50%;opacity:.35;
    transform:translate(-50%,-50%);pointer-events:none;z-index:9997;
    transition:width .32s var(--ease),height .32s var(--ease),border-color .2s,opacity .3s;
  }
  #cdot.hov{width:14px;height:14px;background:var(--terra)}
  #cring.hov{width:54px;height:54px;border-color:var(--terra);opacity:.2}
}

/* ─── HEADER ─── */
header{
  position:fixed;top:0;left:0;right:0;height:var(--hh);z-index:100;
  display:flex;align-items:center;
  padding-inline:clamp(var(--s6),4vw,var(--s16));
  transition:background var(--dur-lg) var(--ease),box-shadow var(--dur),height var(--dur);
}
header.scrolled{
  background:rgba(243,238,228,.93);
  backdrop-filter:blur(20px) saturate(1.4);
  -webkit-backdrop-filter:blur(20px) saturate(1.4);
  box-shadow:0 1px 0 rgba(27,20,9,.07),0 4px 24px rgba(27,20,9,.06);
  height:60px;
}
.hdr-inner{max-width:var(--max);width:100%;margin-inline:auto;
  display:flex;align-items:center;justify-content:space-between;gap:var(--s8)}

.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-mark{width:32px;height:32px;flex-shrink:0}
.logo-name{
  font-family:var(--display);font-size:1.38rem;font-weight:600;
  letter-spacing:-.015em;line-height:1;color:var(--ink);
  transition:color var(--dur);
}
.logo-name em{color:var(--verde-lt);font-style:italic;font-weight:600}
.on-hero header:not(.scrolled){background:linear-gradient(to bottom,rgba(18,20,15,.66),rgba(18,20,15,0))}
.on-hero header:not(.scrolled) .logo-name{color:#F2EDE3}
.on-hero header:not(.scrolled) .logo-name em{color:var(--verde-lt)}

nav.dnav{display:flex;gap:var(--s10)}
nav.dnav a{font-size:var(--t-sm);font-weight:500;color:var(--ink);opacity:.6;
  position:relative;padding-block:2px;transition:opacity var(--dur)}
nav.dnav a::after{content:'';position:absolute;bottom:-2px;left:0;right:0;
  height:1px;background:var(--verde);transform:scaleX(0);transform-origin:left;
  transition:transform var(--dur) var(--ease)}
nav.dnav a:hover{opacity:1}
nav.dnav a:hover::after{transform:scaleX(1)}
.on-hero header:not(.scrolled) nav.dnav a{color:#F2EDE3;opacity:.82}

.hcta{display:inline-flex;align-items:center;gap:var(--s2);
  padding:9px 20px;background:var(--ink);color:var(--parch);
  font-size:var(--t-sm);font-weight:600;border-radius:var(--r-full);
  transition:transform var(--dur) var(--ease),box-shadow var(--dur),background var(--dur)}
.hcta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(27,20,9,.25)}
.on-hero header:not(.scrolled) .hcta{background:rgba(242,237,227,.15);
  border:1px solid rgba(242,237,227,.3);color:#F2EDE3;backdrop-filter:blur(6px)}
.on-hero header:not(.scrolled) .hcta:hover{background:rgba(242,237,227,.25)}

/* Hamburger */
.hbg{display:none;flex-direction:column;gap:5px;
  width:42px;height:42px;align-items:center;justify-content:center;
  border-radius:var(--r-md);transition:background var(--dur)}
.hbg:hover{background:var(--fog)}
.hbg span{display:block;width:20px;height:1.5px;background:currentColor;border-radius:2px;
  transition:transform .3s var(--ease),opacity .2s}
.hbg.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.hbg.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.hbg.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.on-hero header:not(.scrolled) .hbg{color:#F2EDE3}

/* Mobile nav */
.mnav{position:fixed;inset:0;top:var(--hh);background:var(--surf);z-index:99;
  padding:var(--s8) clamp(var(--s6),6vw,var(--s12));
  display:flex;flex-direction:column;
  transform:translateX(110%);transition:transform .4s var(--ease);
  border-top:1px solid rgba(27,20,9,.06)}
.mnav.open{transform:translateX(0)}
.mnav a{font-family:var(--display);font-size:var(--t-xl);font-weight:400;
  color:var(--ink);padding-block:var(--s3);
  border-bottom:1px solid rgba(27,20,9,.07);
  display:flex;justify-content:space-between;align-items:center;
  transition:color var(--dur)}
.mnav a:hover{color:var(--verde)}
.mnav-cta{margin-top:var(--s6);font-family:var(--body)!important;
  font-size:var(--t-sm)!important;font-weight:700!important;
  color:var(--verde)!important;border:none!important;padding-top:var(--s2)!important}

/* ─── HERO ─── */
.hero{position:relative;min-height:100dvh;display:flex;
  flex-direction:column;justify-content:flex-end;overflow:hidden}
.hero-bg{position:absolute;inset:0;overflow:hidden}
.hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 35%;
  transform:scale(1.08);will-change:transform;transition:transform .12s linear}
.hero-bg::after{content:'';position:absolute;inset:0;
  background:
    linear-gradient(to top,rgba(12,22,15,.95) 0%,rgba(12,22,15,.5) 45%,rgba(12,22,15,.12) 100%),
    linear-gradient(to right,rgba(12,22,15,.35) 0%,transparent 55%)}
.hero-content{position:relative;z-index:1;width:100%;max-width:var(--max);
  margin-inline:auto;padding:calc(var(--hh) + var(--s20)) clamp(var(--s6),5vw,var(--s16)) var(--s16)}

.hero-eyebrow{display:inline-flex;align-items:center;gap:var(--s3);
  font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;letter-spacing:.18em;
  color:rgba(242,237,227,.8);margin-bottom:var(--s8);
  opacity:0;transform:translateY(12px);transition:opacity .6s ease .15s,transform .6s var(--ease) .15s}
.hero-eyebrow::before{content:'';display:block;width:28px;height:1px;background:rgba(242,237,227,.55)}
.hero-eyebrow.in{opacity:1;transform:translateY(0)}

.hero-h1{font-family:var(--display);font-size:var(--t-hero);font-weight:400;
  letter-spacing:-.025em;line-height:.92;color:#F2EDE3;
  margin-bottom:var(--s8);overflow:visible}
.hero-h1 .line{display:block;overflow:hidden}
.hero-h1 .word{display:inline-block;
  transform:translateY(105%);opacity:0;
  transition:transform .95s var(--ease),opacity .8s ease}
.hero-h1 .w2{color:var(--verde-lt);font-style:italic;margin-left:.08em}
.hero-h1 .w3{display:block;font-size:.52em;opacity:.55;
  font-style:normal;color:#F2EDE3;letter-spacing:-.01em;margin-top:.1em}
.hero-h1.in .word{transform:translateY(0);opacity:1}
.hero-h1.in .w2{transition-delay:.12s}
.hero-h1.in .w3{transition-delay:.24s}

.hero-sub{font-size:clamp(1rem,.85rem + .75vw,1.25rem);
  color:rgba(242,237,227,.62);max-width:48ch;line-height:1.65;
  margin-bottom:var(--s10);
  opacity:0;transform:translateY(18px);
  transition:opacity .85s ease .5s,transform .85s var(--ease) .5s}
.hero-sub.in{opacity:1;transform:translateY(0)}

.hero-btns{display:flex;flex-wrap:wrap;gap:var(--s4);margin-bottom:var(--s16);
  opacity:0;transform:translateY(16px);
  transition:opacity .8s ease .65s,transform .8s var(--ease) .65s}
.hero-btns.in{opacity:1;transform:translateY(0)}
.btn-h-p,.btn-h-s{display:inline-flex;align-items:center;gap:var(--s2);
  padding:14px 28px;font-size:var(--t-sm);font-weight:600;border-radius:var(--r-full);
  transition:transform var(--dur) var(--ease),box-shadow var(--dur)}
.btn-h-p{background:#F2EDE3;color:var(--selva)}
.btn-h-p:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(242,237,227,.25)}
.btn-h-s{background:rgba(242,237,227,.1);border:1px solid rgba(242,237,227,.2);
  color:#F2EDE3;backdrop-filter:blur(8px)}
.btn-h-s:hover{background:rgba(242,237,227,.18);transform:translateY(-2px)}

.hero-stats{display:flex;flex-wrap:wrap;gap:var(--s10);
  padding-top:var(--s8);border-top:1px solid rgba(242,237,227,.1);
  opacity:0;transform:translateY(14px);
  transition:opacity .8s ease .82s,transform .8s var(--ease) .82s}
.hero-stats.in{opacity:1;transform:translateY(0)}
.hstat-val{font-family:var(--display);font-size:clamp(1.6rem,1.3rem + 1.5vw,2.8rem);
  font-weight:400;color:#F2EDE3;line-height:1;display:flex;align-items:baseline;gap:.05em}
.hstat-val sup{font-size:.55em;color:var(--oro);font-style:italic;margin-left:.06em}
.hstat-lbl{font-size:var(--t-2xs);color:rgba(242,237,227,.4);
  text-transform:uppercase;letter-spacing:.12em;margin-top:var(--s1)}

.scroll-cue{position:absolute;bottom:var(--s8);right:clamp(var(--s6),5vw,var(--s16));
  z-index:2;display:flex;flex-direction:column;align-items:center;gap:var(--s2);
  opacity:.45}
.sc-line{width:1px;height:44px;background:rgba(242,237,227,.25);
  position:relative;overflow:hidden}
.sc-line::after{content:'';position:absolute;top:-100%;width:100%;height:100%;
  background:rgba(242,237,227,.7);animation:sc-drop 2.2s ease infinite}
@keyframes sc-drop{0%{top:-100%}60%,100%{top:200%}}
.sc-txt{font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;
  color:rgba(242,237,227,.4);writing-mode:vertical-rl}

/* ─── MARQUEE ─── */
.marquee{background:var(--selva);padding-block:13px;overflow:hidden;
  border-bottom:1px solid rgba(255,255,255,.04)}
.mq-track{display:flex;width:max-content;animation:mq-roll 36s linear infinite}
.mq-track:hover{animation-play-state:paused}
@keyframes mq-roll{to{transform:translateX(-50%)}}
.mq-item{display:flex;align-items:center;gap:20px;padding-inline:20px;
  white-space:nowrap}
.mq-word{font-size:.7rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.14em;color:rgba(242,237,227,.38)}
.mq-em{font-family:var(--display);font-size:.88rem;font-style:italic;
  font-weight:400;color:rgba(242,237,227,.75);text-transform:none;letter-spacing:0}
.mq-dot{width:3px;height:3px;background:var(--terra);border-radius:50%;opacity:.6;flex-shrink:0}

/* ─── SEARCH ─── */
.search-sec{background:var(--parch);padding-block:clamp(var(--s12),6vw,var(--s20))}
.search-wrap{max-width:780px;margin-inline:auto;
  padding-inline:clamp(var(--s6),5vw,var(--s16));text-align:center}
.search-hed{font-family:var(--display);font-size:var(--t-xl);font-weight:400;
  margin-bottom:var(--s8);line-height:1.15;color:var(--ink)}
.search-hed em{color:var(--verde);font-style:italic}
.sbar{display:flex;background:var(--surf);
  border:1.5px solid rgba(27,20,9,.1);border-radius:var(--r-full);
  padding:var(--s2) var(--s2) var(--s2) var(--s6);gap:var(--s2);
  align-items:center;
  box-shadow:0 2px 16px rgba(27,20,9,.05),0 8px 40px rgba(27,20,9,.04);
  transition:border-color var(--dur),box-shadow var(--dur)}
.sbar:focus-within{border-color:var(--verde);
  box-shadow:0 2px 16px rgba(58,107,71,.1),0 0 0 4px rgba(58,107,71,.06)}
.sbar input{flex:1;border:none;outline:none;background:transparent;
  font:inherit;font-size:var(--t-md);color:var(--ink)}
.sbar input::placeholder{color:rgba(240,232,212,.34)}
.sbtn{display:inline-flex;align-items:center;gap:var(--s2);
  padding:11px 22px;background:var(--ink);color:var(--parch);
  font-size:var(--t-sm);font-weight:600;border-radius:var(--r-full);flex-shrink:0;
  transition:background var(--dur),transform var(--dur) var(--ease)}
.sbtn:hover{background:var(--selva);transform:scale(1.02)}
.pills{display:flex;flex-wrap:wrap;gap:var(--s2);margin-top:var(--s4);justify-content:center}
.pill{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;
  border:1px solid rgba(27,20,9,.1);border-radius:var(--r-full);
  font-size:var(--t-2xs);font-weight:600;color:rgba(27,20,9,.5);
  transition:all var(--dur) var(--ease);cursor:pointer}
.pill:hover{background:var(--verde);color:#fff;border-color:transparent}
.pill svg{width:11px;height:11px;flex-shrink:0}

/* ─── SECTION SHARED ─── */
.sec{padding-block:clamp(var(--s12),7vw,var(--s24))}
.inner{max-width:var(--max);margin-inline:auto;padding-inline:clamp(var(--s6),5vw,var(--s16))}
.eyebrow{display:inline-flex;align-items:center;gap:var(--s3);
  font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;letter-spacing:.14em;
  color:rgba(27,20,9,.38);margin-bottom:var(--s4)}
.eyebrow::before{content:'';display:block;width:18px;height:1px;background:currentColor;opacity:.7}
.sec-h{font-family:var(--display);font-size:var(--t-xl);font-weight:400;
  letter-spacing:-.02em;margin-bottom:var(--s3);color:var(--ink)}
.sec-h em{font-style:italic;color:var(--verde)}
.sec-p{font-size:var(--t-md);color:rgba(27,20,9,.5);max-width:52ch;
  margin-bottom:clamp(var(--s8),4vw,var(--s14))}

/* ─── CATEGORIES (H-SCROLL) ─── */
.cat-sec{background:var(--surf)}
.cat-hdr{display:flex;justify-content:space-between;align-items:flex-end;
  margin-bottom:clamp(var(--s8),4vw,var(--s12))}
.see-all{display:flex;align-items:center;gap:var(--s2);font-size:var(--t-sm);
  font-weight:600;color:var(--verde);transition:gap var(--dur)}
.see-all:hover{gap:var(--s3)}
.see-all svg{width:14px;height:14px}

.cat-scroller-wrap{
  position:relative;
  margin-inline:calc(clamp(var(--s6),5vw,var(--s16)) * -1);
  padding-inline:clamp(var(--s6),5vw,var(--s16));
}
.cat-scroller-wrap::after{
  content:'';position:absolute;top:0;right:0;bottom:0;
  width:80px;
  background:linear-gradient(to right,transparent,var(--surf));
  pointer-events:none;z-index:1;
}
.cat-scroll{display:flex;gap:var(--s4);overflow-x:auto;
  scroll-snap-type:x mandatory;scrollbar-width:none;
  -webkit-overflow-scrolling:touch;padding-bottom:4px}
.cat-scroll::-webkit-scrollbar{display:none}

.ccard{flex:0 0 240px;height:340px;border-radius:var(--r-xl);overflow:hidden;
  position:relative;scroll-snap-align:start;cursor:pointer;
  background:var(--selva)}
.ccard-bg{position:absolute;inset:0;background-size:cover;background-position:center;
  transition:transform .65s var(--ease),filter .4s}
.ccard:hover .ccard-bg{transform:scale(1.07)}
.ccard::after{content:'';position:absolute;inset:0;
  background:linear-gradient(to top,rgba(10,20,14,.85) 0%,rgba(10,20,14,.15) 55%,transparent 100%);
  transition:opacity .4s}
.ccard:hover::after{opacity:.9}
.ccard-body{position:absolute;bottom:0;left:0;right:0;padding:var(--s6);z-index:1}
.ccard-icon{width:34px;height:34px;margin-bottom:var(--s2);
  background:rgba(242,237,227,.12);border-radius:var(--r-sm);
  display:flex;align-items:center;justify-content:center;
  backdrop-filter:blur(6px);transition:background .3s}
.ccard:hover .ccard-icon{background:rgba(130,201,148,.2)}
.ccard-icon svg{width:15px;height:15px;stroke:#F2EDE3;fill:none;
  stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ccard-name{font-family:var(--display);font-size:1.45rem;font-weight:400;
  color:#F2EDE3;line-height:1.05;margin-bottom:var(--s1)}
.ccard-n{font-size:var(--t-2xs);color:rgba(242,237,227,.45);
  text-transform:uppercase;letter-spacing:.1em}
.ccard-wide{flex:0 0 360px;height:340px}

/* ─── FEATURED EDITORIAL ─── */
.feat-sec{background:var(--parch)}
.feat-grid{display:grid;grid-template-columns:3fr 2fr;grid-template-rows:1fr 1fr;
  gap:var(--s4);min-height:540px}
.pcard{position:relative;border-radius:var(--r-xl);overflow:hidden;
  cursor:pointer;background:var(--selva)}
.pcard img{width:100%;height:100%;object-fit:cover;
  transition:transform .7s var(--ease);display:block}
.pcard:hover img{transform:scale(1.05)}
.pcard-ov{position:absolute;inset:0;
  background:linear-gradient(to top,rgba(10,18,12,.9) 0%,rgba(10,18,12,.15) 60%,transparent 100%);
  padding:var(--s6);display:flex;flex-direction:column;justify-content:flex-end;
  transition:background .4s}
.ptag{display:inline-flex;align-items:center;gap:4px;
  padding:3px 11px;background:rgba(191,80,40,.85);border-radius:var(--r-full);
  font-size:.62rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
  color:#fff;width:fit-content;margin-bottom:var(--s3)}
.pname{font-family:var(--display);
  font-size:clamp(1.1rem,.9rem + 1.5vw,2rem);
  color:#F2EDE3;line-height:1.05;margin-bottom:var(--s2)}
.pdesc{font-size:var(--t-sm);color:rgba(242,237,227,.6);line-height:1.5;
  margin-bottom:var(--s4);display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden}
.pmeta{display:flex;gap:var(--s4);align-items:center}
.pstars{color:var(--oro);font-size:.7rem;letter-spacing:2px}
.prev{font-size:var(--t-xs);color:rgba(242,237,227,.4)}

/* Hero vertical card */
.pcard-big{grid-row:span 2}

/* Horizontal small card */
.pcard-sm{display:flex;border-radius:var(--r-lg);overflow:hidden;
  background:var(--surf);border:1px solid rgba(27,20,9,.07);
  transition:box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease)}
.pcard-sm:hover{box-shadow:var(--sh-md);transform:translateY(-2px)}
.pcard-sm-img{width:130px;flex-shrink:0;overflow:hidden;position:relative}
.pcard-sm-img img{width:100%;height:100%;object-fit:cover;
  transition:transform .5s var(--ease)}
.pcard-sm:hover .pcard-sm-img img{transform:scale(1.07)}
.pcard-sm-body{padding:var(--s4);flex:1;display:flex;flex-direction:column;
  justify-content:center;gap:4px}
.pcard-sm-cat{font-size:.65rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.1em;color:var(--terra)}
.pcard-sm-name{font-family:var(--display);font-size:1.05rem;color:var(--ink);line-height:1.2}
.pcard-sm-sub{font-size:var(--t-2xs);color:rgba(240,232,212,.45)}

/* ─── NUMBERS BAND ─── */
.nums-band{background:var(--selva);padding-block:clamp(var(--s12),6vw,var(--s20));
  position:relative;overflow:hidden}
.nums-band::before{content:'MALINALCO';position:absolute;top:50%;left:50%;
  transform:translate(-50%,-50%);font-family:var(--display);
  font-size:clamp(5rem,16vw,14rem);color:rgba(255,255,255,.025);
  white-space:nowrap;pointer-events:none;letter-spacing:-.03em;
  line-height:1;user-select:none}
.nums-grid{display:grid;grid-template-columns:repeat(4,1fr);
  gap:var(--s6);max-width:var(--max);margin-inline:auto;
  padding-inline:clamp(var(--s6),5vw,var(--s16))}
.nitem{text-align:center}
.nval{font-family:var(--display);font-size:clamp(2.5rem,2rem + 2.5vw,5rem);
  font-weight:400;color:#F2EDE3;line-height:1;margin-bottom:var(--s2)}
.nval-suf{color:var(--oro)}
.nlbl{font-size:var(--t-xs);color:rgba(242,237,227,.4);
  text-transform:uppercase;letter-spacing:.1em;line-height:1.5}

/* ─── B2B + PRICING ─── */
.b2b-sec{background:#1B1409;position:relative;overflow:hidden}
.b2b-sec::before{content:'';position:absolute;top:-10%;right:-5%;
  width:55%;height:120%;
  background:radial-gradient(ellipse at 80% 50%,rgba(58,107,71,.12) 0%,transparent 65%);
  pointer-events:none}
.b2b-inner{max-width:var(--max);margin-inline:auto;
  padding:clamp(var(--s16),9vw,var(--s24)) clamp(var(--s6),5vw,var(--s16));
  display:grid;grid-template-columns:1fr 1fr;gap:clamp(var(--s12),6vw,var(--s20));
  align-items:center}
.b2b-text .eyebrow{color:rgba(197,155,28,.65)}
.b2b-text .eyebrow::before{background:rgba(197,155,28,.5);opacity:1}
.b2b-text .sec-h{color:#F2EDE3;margin-bottom:var(--s4)}
.b2b-text .sec-p{color:rgba(242,237,227,.62);margin-bottom:var(--s8)}
.trust-row{display:flex;flex-wrap:wrap;gap:var(--s3);margin-bottom:var(--s10)}
.tchip{display:inline-flex;align-items:center;gap:var(--s2);
  padding:7px 14px;border:1px solid rgba(242,237,227,.12);border-radius:var(--r-full);
  font-size:var(--t-2xs);font-weight:500;color:rgba(242,237,227,.72)}
.tchip svg{width:12px;height:12px;flex-shrink:0;color:var(--oro)}
.b2b-cta{display:inline-flex;align-items:center;gap:var(--s2);
  padding:13px 26px;background:var(--verde);color:#fff;
  font-size:var(--t-sm);font-weight:700;border-radius:var(--r-full);
  transition:transform var(--dur) var(--ease),box-shadow var(--dur),background var(--dur)}
.b2b-cta:hover{transform:translateY(-2px);background:var(--verde-lt);color:var(--selva);box-shadow:0 8px 28px rgba(58,107,71,.32)}

/* Pricing cards */
.pcards{display:flex;flex-direction:column;gap:var(--s3)}
.pcrd{background:rgba(242,237,227,.04);border:1px solid rgba(242,237,227,.07);
  border-radius:var(--r-xl);padding:var(--s6) var(--s6);
  display:flex;justify-content:space-between;align-items:center;gap:var(--s4);
  transition:background var(--dur),border-color var(--dur),transform var(--dur) var(--ease);
  cursor:pointer}
.pcrd:hover{background:rgba(242,237,227,.07);border-color:rgba(242,237,227,.14);
  transform:translateX(5px)}
.pcrd.star{background:rgba(58,107,71,.18);border-color:rgba(58,107,71,.38)}
.pcrd.star:hover{background:rgba(58,107,71,.26)}
.plan-badge{font-size:.58rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.12em;color:var(--verde-lt);background:rgba(130,201,148,.12);
  padding:2px 8px;border-radius:var(--r-full);display:inline-block;margin-bottom:4px}
.plan-name{font-family:var(--display);font-size:1.2rem;font-style:italic;
  font-weight:400;color:#F2EDE3;line-height:1.1;margin-bottom:3px}
.plan-sub{font-size:var(--t-2xs);color:rgba(242,237,227,.5)}
.plan-price{text-align:right;flex-shrink:0}
.plan-amt{font-family:var(--display);font-size:1.6rem;font-weight:400;
  color:#F2EDE3;white-space:nowrap}
.plan-per{font-size:var(--t-2xs);color:rgba(242,237,227,.3)}
.plan-arrow{width:28px;height:28px;border-radius:50%;
  border:1px solid rgba(242,237,227,.12);
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  color:rgba(242,237,227,.4);transition:border-color .2s,color .2s,transform var(--dur) var(--ease)}
.pcrd:hover .plan-arrow{border-color:rgba(242,237,227,.3);
  color:rgba(242,237,227,.8);transform:translateX(3px)}
.pcrd.star .plan-arrow{border-color:rgba(130,201,148,.3);color:var(--verde-lt)}
.pcrd{align-items:flex-start}
.pcrd .plan-price{margin-top:2px}
.plan-feats{list-style:none;margin:var(--s3) 0 0;padding:0;display:flex;flex-direction:column;gap:5px}
.plan-feats li{display:flex;gap:7px;align-items:flex-start;
  font-size:var(--t-2xs);color:rgba(242,237,227,.62);line-height:1.35}
.plan-feats svg{width:11px;height:11px;flex-shrink:0;margin-top:2px;color:var(--verde-lt)}
.pcrd.star .plan-feats li{color:rgba(242,237,227,.78)}

/* Banner Fundadores (gancho de lanzamiento) */
.founders{display:flex;gap:var(--s4);align-items:flex-start;
  background:linear-gradient(135deg,rgba(200,150,60,.14),rgba(58,107,71,.14));
  border:1px solid rgba(200,150,60,.28);border-radius:var(--r-xl);
  padding:var(--s5) var(--s6);margin-bottom:var(--s5)}
.founders-mark{flex-shrink:0;font-size:1.3rem;line-height:1.2}
.founders-body{display:flex;flex-direction:column;gap:3px}
.founders-title{font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;
  letter-spacing:.12em;color:var(--oro)}
.founders-copy{font-size:var(--t-2xs);color:rgba(242,237,227,.72);line-height:1.45}
.founders-copy strong{color:#F2EDE3;font-weight:600}

/* ─── Modal "Cómo funciona" ─── */
.hiw-overlay{position:fixed;inset:0;z-index:600;display:none;align-items:center;justify-content:center;
  padding:var(--s5);background:rgba(10,12,8,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.hiw-overlay:not([hidden]){display:flex}
.hiw-box{position:relative;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;
  background:var(--surf);border:1px solid rgba(242,237,227,.1);border-radius:var(--r-xl);
  padding:var(--s10) var(--s8) var(--s8);box-shadow:0 24px 80px rgba(0,0,0,.5);
  animation:hiw-in .32s var(--ease)}
@keyframes hiw-in{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
.hiw-close{position:absolute;top:var(--s4);right:var(--s4);width:34px;height:34px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;color:rgba(240,232,212,.6);
  border:1px solid rgba(242,237,227,.12);transition:color var(--dur),border-color var(--dur)}
.hiw-close:hover{color:var(--ink);border-color:rgba(242,237,227,.3)}
.hiw-eyebrow{font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;letter-spacing:.14em;
  color:var(--oro);margin-bottom:var(--s2)}
.hiw-title{font-family:var(--display);font-size:var(--t-lg);font-weight:400;color:var(--ink);
  margin-bottom:var(--s6);line-height:1.15}
.hiw-steps{display:flex;flex-direction:column;gap:var(--s5);margin-bottom:var(--s8)}
.hiw-steps li{display:flex;gap:var(--s4);align-items:flex-start}
.hiw-num{flex-shrink:0;width:30px;height:30px;border-radius:50%;background:var(--verde);
  color:#fff;font-weight:700;font-size:var(--t-sm);display:flex;align-items:center;justify-content:center}
.hiw-steps li div{display:flex;flex-direction:column;gap:2px}
.hiw-steps strong{font-size:var(--t-md);font-weight:600;color:var(--ink)}
.hiw-steps span{font-size:var(--t-sm);color:rgba(240,232,212,.62);line-height:1.5}
.hiw-cta{display:inline-flex;align-items:center;justify-content:center;gap:var(--s2);width:100%;
  padding:14px 26px;background:var(--verde);color:#fff;font-size:var(--t-sm);font-weight:700;
  border-radius:var(--r-full);transition:background var(--dur),transform var(--dur) var(--ease)}
.hiw-cta:hover{background:var(--verde-lt);color:var(--selva);transform:translateY(-2px)}
body.hiw-open{overflow:hidden}

/* ─── Modales de documentos y contacto ─── */
.doc-body{font-size:var(--t-sm);line-height:1.65;color:rgba(240,232,212,.72)}
.doc-body h4{font-size:var(--t-sm);font-weight:700;color:var(--ink);margin:var(--s5) 0 var(--s1)}
.doc-body h4:first-of-type{margin-top:0}
.doc-body p{margin-bottom:var(--s3)}
.doc-body strong{color:var(--ink);font-weight:600}
.doc-body a{color:var(--verde-lt);text-decoration:underline;text-underline-offset:2px}
.doc-updated{margin-top:var(--s6);font-size:var(--t-2xs);color:rgba(240,232,212,.42)}
.cform{display:flex;flex-direction:column;gap:var(--s4)}
.cf-field{display:flex;flex-direction:column;gap:6px}
.cf-field label{font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:rgba(240,232,212,.55)}
.cf-field input,.cf-field select,.cf-field textarea{width:100%;padding:12px 14px;background:rgba(242,237,227,.04);
  border:1px solid rgba(242,237,227,.14);border-radius:12px;color:var(--ink);font-size:var(--t-sm);
  font-family:inherit;transition:border-color var(--dur)}
.cf-field textarea{resize:vertical;min-height:88px}
.cf-field input::placeholder,.cf-field textarea::placeholder{color:rgba(240,232,212,.32)}
.cf-field input:focus,.cf-field select:focus,.cf-field textarea:focus{outline:none;border-color:var(--verde-lt)}
.cf-field select{appearance:none;-webkit-appearance:none;cursor:pointer}
.cform .hiw-cta{margin-top:var(--s1)}
.cf-alt{margin-top:var(--s4);text-align:center;font-size:var(--t-2xs);color:rgba(240,232,212,.5)}
.cf-alt a{color:var(--verde-lt)}
.ft-contact{display:flex;flex-direction:column;gap:var(--s2);margin-top:var(--s1)}
.ft-contact a{display:inline-flex;align-items:center;gap:8px;font-size:var(--t-sm);color:rgba(240,232,212,.72);transition:color var(--dur)}
.ft-contact a:hover{color:var(--verde-lt)}
.ft-contact svg{width:15px;height:15px;flex-shrink:0;color:var(--verde-lt)}

/* ─── ARTICLES ─── */
.art-sec{background:var(--parch)}
.art-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s5)}
.acard{background:var(--surf);border-radius:var(--r-xl);overflow:hidden;
  border:1px solid rgba(27,20,9,.06);
  transition:transform var(--dur) var(--ease),box-shadow var(--dur)}
.acard:hover{transform:translateY(-5px);box-shadow:var(--sh-lg)}
.acard-img{aspect-ratio:16/9;overflow:hidden;background:var(--selva)}
.acard-img img{width:100%;height:100%;object-fit:cover;
  transition:transform .6s var(--ease)}
.acard:hover .acard-img img{transform:scale(1.07)}
.acard-body{padding:var(--s6)}
.atag{font-size:.65rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.12em;color:var(--verde);margin-bottom:var(--s2)}
.atitle{font-family:var(--display);font-size:1.15rem;line-height:1.2;
  color:var(--ink);margin-bottom:var(--s3)}
.aexc{font-size:var(--t-sm);color:rgba(240,232,212,.5);line-height:1.6;
  margin-bottom:var(--s4);display:-webkit-box;-webkit-line-clamp:2;
  -webkit-box-orient:vertical;overflow:hidden}
.afoot{display:flex;justify-content:space-between;align-items:center;
  padding-top:var(--s4);border-top:1px solid rgba(27,20,9,.06)}
.adate{font-size:var(--t-xs);color:rgba(240,232,212,.46)}
.aread{font-size:var(--t-xs);font-weight:700;color:var(--verde);
  display:flex;align-items:center;gap:4px;transition:gap var(--dur)}
.acard:hover .aread{gap:8px}
.aread svg{width:12px;height:12px}

/* ─── FOOTER ─── */
footer{background:#1E221A;padding-block:clamp(var(--s12),7vw,var(--s20))}
.ft-inner{max-width:var(--max);margin-inline:auto;
  padding-inline:clamp(var(--s6),5vw,var(--s16))}
.ft-top{display:grid;grid-template-columns:2.2fr 1fr 1fr 1fr;
  gap:clamp(var(--s8),5vw,var(--s16));padding-bottom:var(--s12);
  border-bottom:1px solid rgba(242,237,227,.07)}
.ft-brand p{font-size:var(--t-sm);color:rgba(242,237,227,.38);
  margin-top:var(--s4);line-height:1.75;max-width:30ch}
.ft-socials{display:flex;gap:var(--s3);margin-top:var(--s6)}
.fsoc{width:36px;height:36px;border-radius:var(--r-full);
  border:1px solid rgba(242,237,227,.1);
  display:flex;align-items:center;justify-content:center;
  color:rgba(242,237,227,.4);transition:border-color var(--dur),color var(--dur)}
.fsoc:hover{border-color:rgba(242,237,227,.3);color:rgba(242,237,227,.85)}
.fsoc svg{width:15px;height:15px}
.ft-col h5{font-size:var(--t-2xs);font-weight:700;text-transform:uppercase;
  letter-spacing:.14em;color:rgba(242,237,227,.3);margin-bottom:var(--s5)}
.ft-col a{display:block;font-size:var(--t-sm);color:rgba(242,237,227,.45);
  margin-bottom:var(--s3);transition:color var(--dur)}
.ft-col a:hover{color:rgba(242,237,227,.9)}
.ft-bot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:var(--s4);
  padding-top:var(--s8)}
.ft-bot p{font-size:var(--t-xs);color:rgba(242,237,227,.42)}
.ft-bot p:last-child{color:rgba(242,237,227,.78);font-weight:500}
.ft-heart{color:var(--terra)}

/* ─── THEME TOGGLE ─── */
#ttog{position:fixed;bottom:var(--s6);right:var(--s6);z-index:500;
  width:44px;height:44px;display:flex;align-items:center;justify-content:center;
  background:var(--surf);border:1px solid rgba(27,20,9,.1);border-radius:var(--r-full);
  box-shadow:0 4px 16px rgba(27,20,9,.1);
  transition:transform var(--dur) var(--ease),box-shadow var(--dur),background var(--dur)}
#ttog:hover{transform:scale(1.1) rotate(14deg);box-shadow:0 8px 24px rgba(27,20,9,.14)}
[data-theme=dark] #ttog{background:#252015;border-color:rgba(242,237,227,.1)}
#ttog svg{width:18px;height:18px;color:var(--ink);transition:color var(--dur)}
[data-theme=dark] #ttog svg{color:#F2EDE3}

/* ─── DARK MODE ─── */
[data-theme=dark] body{background:#363B33;color:#F0E8D4}
[data-theme=dark]{
  --parch:#363B33; --surf:#414740; --ink:#F0E8D4; --fog:rgba(240,232,212,.06);
  --selva:#23271F
}
[data-theme=dark] header.scrolled{background:rgba(48,52,44,.92)}
[data-theme=dark] .sbar{background:rgba(255,255,255,.04);border-color:rgba(242,237,227,.08)}
[data-theme=dark] .sbar input{color:#F0E8D4}
[data-theme=dark] .sbtn{background:#F0E8D4;color:#363B33}
[data-theme=dark] .pill{border-color:rgba(242,237,227,.12);color:rgba(242,237,227,.5)}
[data-theme=dark] .pcard-sm{background:#414740;border-color:rgba(242,237,227,.07)}
[data-theme=dark] .pcard-sm-name{color:#F0E8D4}
[data-theme=dark] .acard{background:#414740;border-color:rgba(242,237,227,.06)}
[data-theme=dark] .atitle{color:#F0E8D4}
[data-theme=dark] .afoot{border-top-color:rgba(242,237,227,.06)}
[data-theme=dark] .search-hed{color:#F0E8D4}
[data-theme=dark] .sec-h{color:#F0E8D4}
[data-theme=dark] .sec-p{color:rgba(240,232,212,.45)}
[data-theme=dark] .eyebrow{color:rgba(240,232,212,.35)}
[data-theme=dark] .cat-sec{background:#414740}
[data-theme=dark] .cat-scroller-wrap::after{background:linear-gradient(to right,transparent,#414740)}
[data-theme=dark] .feat-sec{background:#363B33}
[data-theme=dark] .hcta{background:rgba(242,237,227,.1);border:1px solid rgba(242,237,227,.15);color:#F0E8D4}
[data-theme=dark] .logo-name{color:#F0E8D4}
[data-theme=dark] nav.dnav a{color:#F0E8D4}
[data-theme=dark] .mnav{background:#414740}
[data-theme=dark] .mnav a{color:#F0E8D4;border-bottom-color:rgba(242,237,227,.07)}

/* ─── SCROLL REVEAL ─── */
.rv{opacity:0;transform:translateY(28px);
  transition:opacity .75s var(--ease),transform .75s var(--ease)}
.rv.in{opacity:1;transform:translateY(0)}
.rv-d1{transition-delay:.08s}
.rv-d2{transition-delay:.16s}
.rv-d3{transition-delay:.24s}
.rv-d4{transition-delay:.32s}

/* ─── RESPONSIVE ─── */
@media(max-width:1024px){
  .feat-grid{grid-template-columns:1fr 1fr}
  .pcard-big{grid-row:auto;aspect-ratio:4/3}
  .nums-grid{grid-template-columns:repeat(2,1fr)}
  .b2b-inner{grid-template-columns:1fr}
  .ft-top{grid-template-columns:1fr 1fr}
  .mq-track{animation-duration:110s!important}
}
@media(max-width:768px){
  nav.dnav,.hcta{display:none}
  .hbg{display:flex}
  .feat-grid{grid-template-columns:1fr}
  .pcard-big{aspect-ratio:4/3}
  .art-grid{grid-template-columns:1fr}
  .ft-top{grid-template-columns:1fr}
  .ccard{flex:0 0 200px;height:280px}
  .ccard-wide{flex:0 0 290px}
  #ttog{bottom:var(--s4);right:var(--s4)}
  .scroll-cue{display:none}
}
@media(max-width:480px){
  .hero-btns{flex-direction:column}
  .btn-h-p,.btn-h-s{width:100%;justify-content:center}
  .nums-grid{grid-template-columns:repeat(2,1fr);gap:var(--s8)}
  .hero-stats{gap:var(--s6)}
  .b2b-inner{padding-block:var(--s16)}
}
  `;

const MARKUP = `<!-- Progress bar -->
<div id="prog"></div>
<!-- Custom cursor -->
<div id="cdot"></div>
<div id="cring"></div>

<!-- ═══════════════════════ HEADER ═══════════════════════ -->
<header id="hdr">
  <div class="hdr-inner">
    <a href="#" class="logo" aria-label="En Malinalco — Inicio">
      <svg class="logo-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16 Z" fill="#3F6B4B"/>
        <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16" fill="none" stroke="#2E5A3E" stroke-width="0.6"/>
        <path d="M8,18.4 L24,18.4 L28,26.6 L4,26.6 Z" fill="#CBBBA0"/>
        <path d="M6.6,24.3 L25.4,24.3 M7.5,22 L24.5,22 M8.4,19.9 L23.6,19.9" stroke="#9A8A6E" stroke-width="0.7" stroke-linecap="round"/>
        <path d="M8,18.4 L4,26.6 M24,18.4 L28,26.6" stroke="#A99A7E" stroke-width="0.6"/>
        <rect x="7.6" y="12.9" width="16.8" height="5.6" fill="#BBAA8D"/>
        <rect x="9.4" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
        <rect x="20.2" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
        <path d="M14,18.5 L14,14.6 C14,13.6 14.9,13.1 16,13.1 C17.1,13.1 18,13.6 18,14.6 L18,18.5 Z" fill="#2A2016"/>
        <path d="M16,3.2 C18.4,6.8 22,10.6 25,12.9 L7,12.9 C10,10.6 13.6,6.8 16,3.2 Z" fill="#D9A94A"/>
        <path d="M8.8,11.6 Q16,8.8 23.2,11.6 M10.4,9.6 Q16,7.4 21.6,9.6 M12,7.7 Q16,6.2 20,7.7" stroke="#B0863A" stroke-width="0.55" fill="none"/>
        <circle cx="16" cy="3.4" r="0.7" fill="#B0863A"/>
      </svg>
      <span class="logo-name">en<em>malinalco</em></span>
    </a>

    <nav class="dnav" aria-label="Navegación principal">
      <a href="#categorias">Directorio</a>
      <a href="#destacados">Destacados</a>
      <a href="#negocios">Para negocios</a>
      <a href="#articulos">Historias del pueblo</a>
    </nav>

    <div style="display:flex;align-items:center;gap:var(--s3)">
      <a href="#negocios" class="hcta">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Registra tu negocio
      </a>
      <button class="hbg" id="hbg" aria-label="Abrir menú" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

<!-- Mobile nav -->
<nav class="mnav" id="mnav" aria-label="Menú móvil">
  <a href="#categorias">Directorio <span>→</span></a>
  <a href="#destacados">Destacados <span>→</span></a>
  <a href="#negocios">Para negocios <span>→</span></a>
  <a href="#articulos">Historias del pueblo <span>→</span></a>
  <a href="#negocios" class="mnav-cta">Registra tu negocio →</a>
</nav>

<!-- ═══════════════════════ HERO ═══════════════════════ -->
<section class="hero" id="hero" aria-label="Portada">
  <div class="hero-bg" id="hero-bg">
    <img src="/img/hero/portada.webp"
         alt="Vista panorámica de Malinalco, Pueblo Mágico del Estado de México"
         width="1920" height="1080" fetchpriority="high">
  </div>

  <div class="hero-content">
    <p class="hero-eyebrow" id="heyeb">
      <span>Pueblo Mágico</span> · Estado de México
    </p>

    <h1 class="hero-h1" id="hh1" aria-label="Descubre Malinalco de verdad">
      <span class="line">
        <span class="word">Descubre</span>
        <span class="word w2">Malinalco.</span>
      </span>
      <span class="word w3">La guía hecha por quienes vivimos aquí.</span>
    </h1>

    <p class="hero-sub" id="hsub">
      Restaurantes, hoteles, rutas y los rincones que solo conocen los locales. Todo lo que vale la pena, en un solo lugar.
    </p>

    <div class="hero-btns" id="hbtns">
      <a href="#categorias" class="btn-h-p">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        Explorar el directorio
      </a>
      <a href="#articulos" class="btn-h-s">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        Historias del pueblo
      </a>
    </div>

    <div class="hero-stats" id="hstats">
      <div class="hstat">
        <div class="hstat-val"><span data-count="7">0</span></div>
        <div class="hstat-lbl">Negocios registrados</div>
      </div>
      <div class="hstat">
        <div class="hstat-val"><span data-count="12">0</span></div>
        <div class="hstat-lbl">Categorías</div>
      </div>
      <div class="hstat">
        <div class="hstat-val"><span data-count="244">0</span></div>
        <div class="hstat-lbl">Visitas al mes</div>
      </div>
      <div class="hstat">
        <div class="hstat-val"><span data-count="4" data-decimal="8">0</span><sup>/5</sup></div>
        <div class="hstat-lbl">Calificación promedio</div>
      </div>
    </div>
  </div>

  <div class="scroll-cue" aria-hidden="true">
    <div class="sc-line"></div>
    <span class="sc-txt">Explora</span>
  </div>
</section>

<!-- ═══════════════════════ MARQUEE ═══════════════════════ -->
<div class="marquee" aria-hidden="true">
  <div class="mq-track" id="mq-track">
    <!-- First set -->
    <div class="mq-item"><span class="mq-word">Gastronomía</span><span class="mq-dot"></span><span class="mq-em">Cocina Tradicional</span><span class="mq-dot"></span><span class="mq-word">Hospedaje</span><span class="mq-dot"></span><span class="mq-em">Hoteles Boutique</span><span class="mq-dot"></span><span class="mq-word">Cultura</span><span class="mq-dot"></span><span class="mq-em">Zona Arqueológica</span><span class="mq-dot"></span><span class="mq-word">Spa & Bienestar</span><span class="mq-dot"></span><span class="mq-em">Naturaleza Viva</span><span class="mq-dot"></span><span class="mq-word">Artesanías</span><span class="mq-dot"></span><span class="mq-em">Arte Local</span><span class="mq-dot"></span><span class="mq-word">Ecoturismo</span><span class="mq-dot"></span><span class="mq-em">Rutas de Montaña</span><span class="mq-dot"></span></div>
    <!-- Duplicate for seamless loop -->
    <div class="mq-item"><span class="mq-word">Gastronomía</span><span class="mq-dot"></span><span class="mq-em">Cocina Tradicional</span><span class="mq-dot"></span><span class="mq-word">Hospedaje</span><span class="mq-dot"></span><span class="mq-em">Hoteles Boutique</span><span class="mq-dot"></span><span class="mq-word">Cultura</span><span class="mq-dot"></span><span class="mq-em">Zona Arqueológica</span><span class="mq-dot"></span><span class="mq-word">Spa & Bienestar</span><span class="mq-dot"></span><span class="mq-em">Naturaleza Viva</span><span class="mq-dot"></span><span class="mq-word">Artesanías</span><span class="mq-dot"></span><span class="mq-em">Arte Local</span><span class="mq-dot"></span><span class="mq-word">Ecoturismo</span><span class="mq-dot"></span><span class="mq-em">Rutas de Montaña</span><span class="mq-dot"></span></div>
  </div>
</div>

<!-- ═══════════════════════ SEARCH ═══════════════════════ -->
<div class="search-sec">
  <div class="search-wrap">
    <h2 class="search-hed rv">¿Qué quieres <em>descubrir</em> hoy?</h2>
    <div class="sbar">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(27,20,9,.35)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="search" placeholder="Restaurantes, hoteles, spas, rutas…" aria-label="Buscar en Malinalco">
      <button class="sbtn">Buscar</button>
    </div>
    <div class="pills" role="list" aria-label="Búsquedas populares">
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h1a1 1 0 0 1 1 1v13a1 1 0 0 0 1 1h15"/><path d="M8 6h8"/><path d="M6 10h10"/><path d="M11 14h5"/></svg>
        Restaurantes
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
        Hospedaje
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Zona arqueológica
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
        Spa & bienestar
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l4-8 4 4 4-6 4 10"/></svg>
        Rutas naturales
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
        Farmacias
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 20v-6h6v6"/></svg>
        Tiendas / Mini súper
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14l-7 8z"/><path d="M12 12v7"/><path d="M8 20h8"/></svg>
        Bares
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2"/><path d="M4 11a8 8 0 0 1 16 0z"/><path d="M12 11v9"/><path d="M9 20h6"/></svg>
        Terrazas
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2 5 4-14 2 9h6"/></svg>
        Clínicas
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.5 2.5-2.5-.7-.7-2.5z"/></svg>
        Ferreterías
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
        Papelerías
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7v10"/><path d="M18 7v10"/><path d="M3 9v6"/><path d="M21 9v6"/><path d="M6 12h12"/></svg>
        Gimnasios
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
        Galería de Arte
      </button>
      <button class="pill" role="listitem">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="9" r="2"/><circle cx="8" cy="15" r="2"/><path d="M9.7 15.5a3 3 0 0 0 5.2 0c1-1.8 2.1-2 2.6-3.5.6-1.9-.8-4-3-4s-2.9 1-4.5 1-2.3-1-4.5-1-3.6 2.1-3 4c.5 1.5 1.6 1.7 2.6 3.5"/></svg>
        Veterinarias
      </button>
    </div>
  </div>
</div>

<!-- ═══════════════════════ CATEGORÍAS ═══════════════════════ -->
<section class="sec cat-sec" id="categorias">
  <div class="inner">
    <div class="cat-hdr rv">
      <div>
        <p class="eyebrow">Directorio</p>
        <h2 class="sec-h">Explora por <em>categoría</em></h2>
      </div>
      <a href="#" class="see-all">
        Ver todo
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>
  </div>

  <div class="cat-scroller-wrap inner" style="padding-right:0;max-width:none">
    <div class="cat-scroll" role="list" aria-label="Categorías del directorio">

      <a href="/categoria/restaurantes" class="ccard ccard-wide" role="listitem" style="background:#1C3B28">
        <div class="ccard-bg" style="background-image:url('/img/categorias/01-restaurantes.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
          </div>
          <div class="ccard-name">Restaurantes</div>
          <div class="ccard-n">42 lugares</div>
        </div>
      </a>

      <a href="/categoria/hospedaje" class="ccard" role="listitem" style="background:#1C2E3B">
        <div class="ccard-bg" style="background-image:url('/img/categorias/02-hospedaje.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
          </div>
          <div class="ccard-name">Hospedaje</div>
          <div class="ccard-n">28 opciones</div>
        </div>
      </a>

      <a href="/categoria/spa-bienestar" class="ccard" role="listitem" style="background:#2B1C1C">
        <div class="ccard-bg" style="background-image:url('/img/categorias/03-spa-bienestar.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10"/><path d="M12 6v6l4 2"/></svg>
          </div>
          <div class="ccard-name">Spa & Bienestar</div>
          <div class="ccard-n">17 centros</div>
        </div>
      </a>

      <a href="/categoria/ecoturismo-aventura" class="ccard" role="listitem" style="background:#1C1C2B">
        <div class="ccard-bg" style="background-image:url('/img/categorias/04-ecoturismo.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
          </div>
          <div class="ccard-name">Ecoturismo</div>
          <div class="ccard-n">21 rutas</div>
        </div>
      </a>

      <a href="/categoria/artesanias-tiendas" class="ccard" role="listitem" style="background:#2B1C24">
        <div class="ccard-bg" style="background-image:url('/img/categorias/05-artesanias.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <div class="ccard-name">Artesanías</div>
          <div class="ccard-n">23 tiendas</div>
        </div>
      </a>

      <a href="/categoria/cultura-turismo" class="ccard" role="listitem" style="background:#1E1C2E">
        <div class="ccard-bg" style="background-image:url('/img/categorias/06-cultura.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="ccard-name">Cultura</div>
          <div class="ccard-n">14 sitios</div>
        </div>
      </a>
      <a href="/categoria/servicios" class="ccard" role="listitem" style="background:#1C2B24">
        <div class="ccard-bg" style="background-image:url('/img/categorias/07-servicios.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon"><svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a2 2 0 1 0 2.8 2.8l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-.6-.6-2.1z"/></svg></div>
          <div class="ccard-name">Servicios</div>
          <div class="ccard-n">🛠️ Directorio</div>
        </div>
      </a>
      <a href="/categoria/eventos-experiencias" class="ccard" role="listitem" style="background:#2B241C">
        <div class="ccard-bg" style="background-image:url('/img/categorias/08-eventos.webp')"></div>
        <div class="ccard-body">
          <div class="ccard-icon"><svg viewBox="0 0 24 24"><path d="M4 5h16v16H4z"/><path d="M16 3v4M8 3v4M4 11h16"/></svg></div>
          <div class="ccard-name">Eventos</div>
          <div class="ccard-n">🎉 Experiencias</div>
        </div>
      </a>

    </div>
  </div>
</section>

<!-- ═══════════════════════ DESTACADOS ═══════════════════════ -->
<section class="sec feat-sec" id="destacados">
  <div class="inner">
    <p class="eyebrow rv">Lo mejor de Malinalco</p>
    <h2 class="sec-h rv rv-d1">Lugares <em>que amamos</em>, elegidos por locales</h2>
    <p class="sec-p rv rv-d2">Escogidos a mano por quienes conocen el pueblo de adentro: el restaurante que no se anuncia, el hotel que enamora, la ruta que pocos conocen.</p>

    <div class="feat-grid">

      <!-- BIG CARD -->
      <div class="pcard pcard-big rv">
        <img src="/img/destacados/big-zona-arqueologica.webp" alt="Cerro de los Ídolos — zona arqueológica de Malinalco" width="600" height="800" loading="lazy">
        <div class="pcard-ov">
          <span class="ptag">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Zona Arqueológica
          </span>
          <h3 class="pname">Cerro de los Ídolos</h3>
          <p class="pdesc">El templo monolítico tallado en la roca viva, único en Mesoamérica. Subir sus escalones es asomarse al Malinalco prehispánico.</p>
          <div class="pmeta">
            <span class="prev">Zona INAH · Guía disponible</span>
          </div>
        </div>
      </div>

      <!-- Small cards column -->
      <div style="display:flex;flex-direction:column;gap:var(--s4)">

        <div class="pcard-sm rv rv-d1">
          <div class="pcard-sm-img">
            <img src="/img/destacados/01-mercado-artesanal.webp" alt="Mercado Artesanal de Malinalco" width="260" height="200" loading="lazy">
          </div>
          <div class="pcard-sm-body">
            <div class="pcard-sm-cat">Artesanías</div>
            <div class="pcard-sm-name">Mercado Artesanal</div>
            <div class="pcard-sm-sub">Textiles, barro y dulces típicos</div>
          </div>
        </div>

        <div class="pcard-sm rv rv-d2">
          <div class="pcard-sm-img">
            <img src="/img/destacados/02-parroquia.webp" alt="Parroquia del Divino Salvador — Malinalco" width="260" height="200" loading="lazy">
          </div>
          <div class="pcard-sm-body">
            <div class="pcard-sm-cat">Cultura</div>
            <div class="pcard-sm-name">Parroquia del Divino Salvador</div>
            <div class="pcard-sm-sub">Arquitectura virreinal en el corazón del pueblo</div>
          </div>
        </div>

        <div class="pcard-sm rv rv-d3">
          <div class="pcard-sm-img">
            <img src="/img/destacados/03-museo-bichos.webp" alt="Museo Vivo Los Bichos — Malinalco" width="260" height="200" loading="lazy">
          </div>
          <div class="pcard-sm-body">
            <div class="pcard-sm-cat">Museo Vivo</div>
            <div class="pcard-sm-name">Los Bichos</div>
            <div class="pcard-sm-sub">Insectos y reptiles vivos de cerca</div>
          </div>
        </div>

        <div class="pcard-sm rv rv-d4">
          <div class="pcard-sm-img">
            <img src="/img/destacados/04-criadero-truchas.webp" alt="Criadero de Truchas — Malinalco" width="260" height="200" loading="lazy">
          </div>
          <div class="pcard-sm-body">
            <div class="pcard-sm-cat">Naturaleza</div>
            <div class="pcard-sm-name">Criadero de Truchas</div>
            <div class="pcard-sm-sub">Pesca y trucha fresca entre montañas</div>
          </div>
        </div>

        <div class="pcard-sm rv rv-d4">
          <div class="pcard-sm-img">
            <img src="/img/destacados/05-museo-schneider.webp" alt="Museo Universitario Dr. Luis Mario Schneider — Malinalco" width="260" height="200" loading="lazy">
          </div>
          <div class="pcard-sm-body">
            <div class="pcard-sm-cat">Cultura</div>
            <div class="pcard-sm-name">Museo Mario Schneider</div>
            <div class="pcard-sm-sub">Historia y arte de Malinalco</div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>


<!-- ═══════════════════════ B2B + PRICING ═══════════════════════ -->
<section class="b2b-sec" id="negocios">
  <div class="b2b-inner">

    <!-- Text side -->
    <div class="b2b-text">
      <p class="eyebrow rv">Para dueños de negocio</p>
      <h2 class="sec-h rv rv-d1">¿Tienes un negocio en <em style="color:var(--verde-lt)">Malinalco</em>?</h2>
      <p class="sec-p rv rv-d2">
        Miles de turistas visitan <em style="color:var(--verde-lt);font-style:normal;font-weight:600">Mali</em> cada fin de semana buscando dónde comer, en qué lugar hospedarse y qué hacer en el pueblo. Anúnciate en enmalinalco.com y ellos te encontrarán a ti primero.
      </p>

      <div class="trust-row rv rv-d2">
        <span class="tchip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Control total de tu ficha
        </span>
        <span class="tchip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Conocemos a los turistas
        </span>
        <span class="tchip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Ficha visible los 7 días
        </span>
        <span class="tchip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Actualízalo desde tu celular
        </span>
      </div>

      <button type="button" id="b2b-steps" class="b2b-cta rv rv-d3" aria-haspopup="dialog">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        ¿Cómo funciona?
      </button>
    </div>

    <!-- Pricing cards side -->
    <div class="pcards rv rv-d1">

      <div class="founders">
        <span class="founders-mark">🌵</span>
        <div class="founders-body">
          <span class="founders-title">Fundadores de enmalinalco</span>
          <span class="founders-copy">Los primeros <strong>15 negocios</strong> entran con <strong>2 meses gratis</strong> en Cuāuhtli u Ocēlōtl. Sin tarjeta, sin permanencia — a cambio, estrenas el directorio del pueblo.</span>
        </div>
      </div>

      <div class="pcrd" tabindex="0" data-tier="malinalli">
        <div>
          <div class="plan-badge">Básico</div>
          <div class="plan-name">Malinalli</div>
          <div class="plan-sub">Existe en el pueblo digital</div>
          <ul class="plan-feats">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>3 fotos de tu negocio</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Contacto, ubicación y horarios</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Ficha visible los 7 días</li>
          </ul>
        </div>
        <div class="plan-price">
          <div class="plan-amt">$99</div>
          <div class="plan-per">/mes MXN</div>
        </div>
      </div>

      <div class="pcrd star" tabindex="0" data-tier="cuauhtli">
        <div>
          <div class="plan-badge">⭐ Más popular</div>
          <div class="plan-name">Cuāuhtli</div>
          <div class="plan-sub">Que te encuentren primero</div>
          <ul class="plan-feats">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>10 fotos de tu negocio</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Apareces antes en tu categoría</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Insignia "Recomendado"</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>1 mención al mes en nuestras redes</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Reporte de cuánta gente te vio</li>
          </ul>
        </div>
        <div class="plan-price">
          <div class="plan-amt">$249</div>
          <div class="plan-per">/mes MXN</div>
        </div>
      </div>

      <div class="pcrd" tabindex="0" data-tier="ocelotl">
        <div>
          <div class="plan-badge">Élite</div>
          <div class="plan-name">Ocēlōtl</div>
          <div class="plan-sub">El negocio de referencia del pueblo</div>
          <ul class="plan-feats">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>30 fotos de tu negocio</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Primer lugar en tu categoría</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Tu historia contada (artículo editorial)</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Apareces en la portada</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Línea directa por WhatsApp conmigo</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Vas primero cuando el pueblo se llena</li>
          </ul>
        </div>
        <div class="plan-price">
          <div class="plan-amt">$449</div>
          <div class="plan-per">/mes MXN</div>
        </div>
      </div>

      <p style="font-size:var(--t-sm);color:rgba(242,237,227,.6);text-align:center;margin-top:var(--s3);letter-spacing:.01em">
        Sin contratos de permanencia · Cancela cuando quieras
      </p>
    </div>

  </div>
</section>

<!-- ═══════════════════════ MODAL "CÓMO FUNCIONA" ═══════════════════════ -->
<div class="hiw-overlay" id="hiw" role="dialog" aria-modal="true" aria-labelledby="hiw-title" hidden>
  <div class="hiw-box">
    <button type="button" class="hiw-close" id="hiw-close" aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <p class="hiw-eyebrow">Anúnciate en enmalinalco.com</p>
    <h3 class="hiw-title" id="hiw-title">Es fácil, y tú tienes el control</h3>
    <ol class="hiw-steps">
      <li><span class="hiw-num">1</span><div><strong>Regístrate</strong><span>Crea tu cuenta en un minuto, sin complicaciones.</span></div></li>
      <li><span class="hiw-num">2</span><div><strong>Llena tu ficha</strong><span>Datos, fotos, horarios y todo lo de tu establecimiento.</span></div></li>
      <li><span class="hiw-num">3</span><div><strong>Personalízala a tu gusto</strong><span>Actualiza, modifica y mejora cuando quieras, desde tu celular o laptop. El espacio es tuyo.</span></div></li>
      <li><span class="hiw-num">4</span><div><strong>Listo, estás arriba</strong><span>Visible y fácil de encontrar, recibiendo más clientes.</span></div></li>
    </ol>
    <a href="https://wa.me/525562513258?text=%C2%A1Hola!%20Me%20interesa%20anunciar%20mi%20negocio%20en%20enmalinalco.com.%20%C2%BFMe%20compartes%20m%C3%A1s%20informaci%C3%B3n%3F" target="_blank" rel="noopener noreferrer" class="hiw-cta">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      Empezar por WhatsApp
    </a>
  </div>
</div>

<!-- Modal Contacto -->
<div class="hiw-overlay" id="m-contacto" role="dialog" aria-modal="true" aria-labelledby="mc-title" hidden>
  <div class="hiw-box">
    <button type="button" class="hiw-close" aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <p class="hiw-eyebrow">Estamos para ayudarte</p>
    <h3 class="hiw-title" id="mc-title">Hablemos</h3>
    <form class="cform" id="cform">
      <div class="cf-field">
        <label for="cf-nombre">Tu nombre</label>
        <input id="cf-nombre" name="nombre" type="text" placeholder="¿Cómo te llamas?" required>
      </div>
      <div class="cf-field">
        <label for="cf-motivo">¿En qué te ayudamos?</label>
        <select id="cf-motivo" name="motivo">
          <option>Quiero anunciar mi negocio</option>
          <option>Sugerir un lugar o corregir información</option>
          <option>Soy visitante y tengo una duda</option>
          <option>Otro</option>
        </select>
      </div>
      <div class="cf-field">
        <label for="cf-msg">Tu mensaje</label>
        <textarea id="cf-msg" name="mensaje" placeholder="Cuéntanos en qué podemos apoyarte…" required></textarea>
      </div>
      <button type="submit" class="hiw-cta">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
        Enviar correo
      </button>
    </form>
    <p class="cf-alt">O escríbenos directo: <a href="mailto:soporte@enmalinalco.com">soporte@enmalinalco.com</a> · <a href="https://wa.me/525562513258" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
  </div>
</div>

<!-- Modal Aviso de privacidad -->
<div class="hiw-overlay" id="m-privacidad" role="dialog" aria-modal="true" aria-labelledby="mp-title" hidden>
  <div class="hiw-box">
    <button type="button" class="hiw-close" aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <p class="hiw-eyebrow">Tu confianza primero</p>
    <h3 class="hiw-title" id="mp-title">Aviso de privacidad</h3>
    <div class="doc-body">
      <p>En <strong>enmalinalco.com</strong> cuidamos tu información como cuidamos nuestro pueblo. Aquí te explicamos cómo, sin letras chiquitas.</p>
      <h4>Qué datos recogemos</h4>
      <p>Solo los que tú nos compartes: tu nombre y tu correo o WhatsApp cuando nos escribes, y los datos de tu establecimiento si registras un negocio. Nada que no nos hayas dado a propósito.</p>
      <h4>Para qué los usamos</h4>
      <p>Únicamente para responderte, publicar la ficha de tu negocio y mejorar la guía. Para nada más.</p>
      <h4>Lo que nunca hacemos</h4>
      <p>No vendemos, rentamos ni intercambiamos tu información con terceros. Punto.</p>
      <h4>Tú tienes el control</h4>
      <p>Puedes pedirnos acceder, corregir o eliminar tus datos cuando quieras. Solo escríbenos a <a href="mailto:soporte@enmalinalco.com">soporte@enmalinalco.com</a> y lo resolvemos.</p>
      <p class="doc-updated">Última actualización: septiembre 2026 · Malinalco, Estado de México.</p>
    </div>
  </div>
</div>

<!-- Modal Términos de uso -->
<div class="hiw-overlay" id="m-terminos" role="dialog" aria-modal="true" aria-labelledby="mt-title" hidden>
  <div class="hiw-box">
    <button type="button" class="hiw-close" aria-label="Cerrar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>
    <p class="hiw-eyebrow">Claro y sin trampas</p>
    <h3 class="hiw-title" id="mt-title">Términos de uso</h3>
    <div class="doc-body">
      <p>Gracias por usar <strong>enmalinalco.com</strong>, la guía del pueblo hecha por locales. Al navegar el sitio aceptas estos términos, escritos claro.</p>
      <h4>Qué es esta guía</h4>
      <p>Un directorio informativo de negocios, lugares e historias de Malinalco. Trabajamos para que sea útil y confiable, aunque la información es orientativa.</p>
      <h4>Confirma antes de ir</h4>
      <p>Horarios, precios y disponibilidad pueden cambiar. Te recomendamos confirmar directamente con cada negocio antes de tu visita.</p>
      <h4>Los negocios son suyos</h4>
      <p>Cada establecimiento es responsable de la información de su ficha. enmalinalco.com no presta los servicios anunciados ni responde por ellos.</p>
      <h4>Contenido propio</h4>
      <p>Los textos, fotos y el diseño de la guía son nuestros; te agradecemos no reproducirlos sin permiso.</p>
      <h4>¿Dudas?</h4>
      <p>Escríbenos a <a href="mailto:soporte@enmalinalco.com">soporte@enmalinalco.com</a>. Con gusto te ayudamos.</p>
      <p class="doc-updated">Última actualización: septiembre 2026 · Malinalco, Estado de México.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════ ARTÍCULOS ═══════════════════════ -->
<section class="sec art-sec" id="articulos">
  <div class="inner">
    <p class="eyebrow rv">Blog editorial</p>
    <h2 class="sec-h rv rv-d1">Historias <em>del pueblo</em></h2>
    <p class="sec-p rv rv-d2">Rutas, gastronomía, festividades y los secretos que hacen único a Malinalco.</p>

    <div class="art-grid">

      <article class="acard rv">
        <div class="acard-img">
          <img src="/img/articulos/01-gastronomia.webp" alt="Ruta gastronómica en Malinalco" width="600" height="338" loading="lazy">
        </div>
        <div class="acard-body">
          <div class="atag">Gastronomía</div>
          <h3 class="atitle">La ruta del sabor: 7 lugares imperdibles para comer en Malinalco</h3>
          <p class="aexc">Desde el mercado hasta los restaurantes ocultos, una guía honesta con los mejores platillos del pueblo.</p>
          <div class="afoot">
            <span class="adate">12 May 2026 · 6 min</span>
            <span class="aread">Leer <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
          </div>
        </div>
      </article>

      <article class="acard rv rv-d1">
        <div class="acard-img">
          <img src="/img/articulos/02-zona-arqueologica.webp" alt="Zona arqueológica de Malinalco" width="600" height="338" loading="lazy">
        </div>
        <div class="acard-body">
          <div class="atag">Historia</div>
          <h3 class="atitle">La zona arqueológica: todo lo que debes saber antes de visitar</h3>
          <p class="aexc">El único templo azteca tallado en roca viva. Su historia, cómo llegar y qué no te puedes perder.</p>
          <div class="afoot">
            <span class="adate">5 May 2026 · 8 min</span>
            <span class="aread">Leer <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
          </div>
        </div>
      </article>

      <article class="acard rv rv-d2">
        <div class="acard-img">
          <img src="/img/articulos/03-fin-de-semana.webp" alt="Fin de semana perfecto en Malinalco" width="600" height="338" loading="lazy">
        </div>
        <div class="acard-body">
          <div class="atag">Itinerarios</div>
          <h3 class="atitle">48 horas perfectas en Malinalco: el itinerario definitivo</h3>
          <p class="aexc">Qué hacer, dónde comer y dónde dormir si solo tienes un fin de semana para descubrir el pueblo mágico.</p>
          <div class="afoot">
            <span class="adate">28 Abr 2026 · 5 min</span>
            <span class="aread">Leer <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>

<!-- ═══════════════════════ FOOTER ═══════════════════════ -->
<footer>
  <div class="ft-inner">
    <div class="ft-top">
      <div class="ft-brand">
        <a href="#" class="logo" aria-label="En Malinalco — Inicio">
          <svg class="logo-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16 Z" fill="#3F6B4B"/>
            <path d="M2,16 C3,8.5 9,3.5 16,3.5 C23,3.5 29,8.5 30,16" fill="none" stroke="#2E5A3E" stroke-width="0.6"/>
            <path d="M8,18.4 L24,18.4 L28,26.6 L4,26.6 Z" fill="#CBBBA0"/>
            <path d="M6.6,24.3 L25.4,24.3 M7.5,22 L24.5,22 M8.4,19.9 L23.6,19.9" stroke="#9A8A6E" stroke-width="0.7" stroke-linecap="round"/>
            <path d="M8,18.4 L4,26.6 M24,18.4 L28,26.6" stroke="#A99A7E" stroke-width="0.6"/>
            <rect x="7.6" y="12.9" width="16.8" height="5.6" fill="#BBAA8D"/>
            <rect x="9.4" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <rect x="20.2" y="14.2" width="2.4" height="4.3" fill="#33281D"/>
            <path d="M14,18.5 L14,14.6 C14,13.6 14.9,13.1 16,13.1 C17.1,13.1 18,13.6 18,14.6 L18,18.5 Z" fill="#2A2016"/>
            <path d="M16,3.2 C18.4,6.8 22,10.6 25,12.9 L7,12.9 C10,10.6 13.6,6.8 16,3.2 Z" fill="#D9A94A"/>
            <path d="M8.8,11.6 Q16,8.8 23.2,11.6 M10.4,9.6 Q16,7.4 21.6,9.6 M12,7.7 Q16,6.2 20,7.7" stroke="#B0863A" stroke-width="0.55" fill="none"/>
            <circle cx="16" cy="3.4" r="0.7" fill="#B0863A"/>
          </svg>
          <span class="logo-name" style="color:#F2EDE3">en<em>malinalco</em></span>
        </a>
        <p>Malinalco contado por su gente. Lo que comemos, lo que celebramos y los rincones que solo conocemos los de aquí.</p>
        <div class="ft-socials" hidden>
          <a href="#" class="fsoc" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#" class="fsoc" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </a>
          <a href="#" class="fsoc" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </a>
        </div>
        <div class="ft-contact">
          <a href="https://wa.me/525562513258" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            55 6251 3258
          </a>
          <a href="mailto:soporte@enmalinalco.com">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
            soporte@enmalinalco.com
          </a>
        </div>
      </div>

      <div class="ft-col">
        <h5>Directorio</h5>
        <a href="#">Restaurantes</a>
        <a href="#">Hospedaje</a>
        <a href="#">Spa & Bienestar</a>
        <a href="#">Artesanías</a>
        <a href="#">Ecoturismo</a>
        <a href="#">Cultura</a>
      </div>

      <div class="ft-col">
        <h5>Contenido</h5>
        <a href="#">Historias del pueblo</a>
        <a href="#">Rutas</a>
        <a href="#">Gastronomía</a>
        <a href="#">Historia</a>
        <a href="#">Eventos</a>
      </div>

      <div class="ft-col">
        <h5>Negocio</h5>
        <a href="#">Registrar negocio</a>
        <a href="#">Planes y precios</a>
        <a href="#" data-modal="m-contacto">Contacto</a>
        <a href="#" data-modal="m-privacidad">Aviso de privacidad</a>
        <a href="#" data-modal="m-terminos">Términos de uso</a>
      </div>
    </div>

    <div class="ft-bot">
      <p>© 2026 enmalinalco.com · Todos los derechos reservados</p>
      <p>Hecho con <span class="ft-heart">♥</span> desde Malinalco, México</p>
    </div>
  </div>
</footer>

`;

export default function Home() {
  useEffect(() => {
    document.body.classList.add("on-hero");
    document.documentElement.setAttribute("data-theme", "dark");

    const run = () => {
      /* ──────────────────────────────────────────
         EN MALINALCO V2 — Interaction Layer
      ────────────────────────────────────────── */
      (function(){
      
        /* Theme — único (Cantera al atardecer), sin toggle */
        document.documentElement.setAttribute('data-theme', 'dark');

        /* Progress bar */
        const prog = document.getElementById('prog');
        window.addEventListener('scroll', () => {
          const st = document.documentElement.scrollTop;
          const dh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          prog.style.width = (st / dh * 100) + '%';
        }, { passive: true });
      
        /* Header behaviour + on-hero class */
        const hdr = document.getElementById('hdr');
        const heroEl = document.getElementById('hero');
        const body = document.body;
        function onScroll() {
          const scrolled = window.scrollY > 60;
          hdr.classList.toggle('scrolled', scrolled);
          const heroBottom = heroEl.getBoundingClientRect().bottom;
          body.classList.toggle('on-hero', heroBottom > 100);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
      
        /* Hero parallax */
        const heroBg = document.getElementById('hero-bg');
        const heroImg = heroBg && heroBg.querySelector('img');
        window.addEventListener('scroll', () => {
          if (!heroImg) return;
          const sy = window.scrollY;
          if (sy < window.innerHeight * 1.2) {
            heroImg.style.transform = `scale(1.08) translateY(${sy * 0.22}px)`;
          }
        }, { passive: true });
      
        /* Hero entrance animation */
        function runHeroAnim() {
          const eyeb = document.getElementById('heyeb');
          const hh1  = document.getElementById('hh1');
          const hsub = document.getElementById('hsub');
          const hbtns = document.getElementById('hbtns');
          const hstats = document.getElementById('hstats');
          setTimeout(() => eyeb  && eyeb.classList.add('in'), 80);
          setTimeout(() => hh1   && hh1.classList.add('in'),  180);
          setTimeout(() => hsub  && hsub.classList.add('in'),  520);
          setTimeout(() => hbtns && hbtns.classList.add('in'), 660);
          setTimeout(() => hstats && hstats.classList.add('in'), 840);
        }
        if (document.readyState === 'complete') { runHeroAnim(); }
        else { window.addEventListener('load', runHeroAnim); }
      
        /* Custom cursor */
        const cdot  = document.getElementById('cdot');
        const cring = document.getElementById('cring');
        if (cdot && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
          let cx = 0, cy = 0, tx = 0, ty = 0;
          let rx = 0, ry = 0;
          document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
          (function tickDot() {
            cdot.style.left = tx + 'px';
            cdot.style.top  = ty + 'px';
            requestAnimationFrame(tickDot);
          })();
          (function tickRing() {
            rx += (tx - rx) * 0.11;
            ry += (ty - ry) * 0.11;
            cring.style.left = rx + 'px';
            cring.style.top  = ry + 'px';
            requestAnimationFrame(tickRing);
          })();
          document.querySelectorAll('a,button,[role=button]').forEach(el => {
            el.addEventListener('mouseenter', () => { cdot.classList.add('hov'); cring.classList.add('hov'); });
            el.addEventListener('mouseleave', () => { cdot.classList.remove('hov'); cring.classList.remove('hov'); });
          });
        }
      
        /* Hamburger menu */
        const hbg  = document.getElementById('hbg');
        const mnav = document.getElementById('mnav');
        hbg.addEventListener('click', () => {
          const isOpen = mnav.classList.toggle('open');
          hbg.classList.toggle('open', isOpen);
          hbg.setAttribute('aria-expanded', isOpen);
          document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        mnav.querySelectorAll('a').forEach(a => {
          a.addEventListener('click', () => {
            mnav.classList.remove('open');
            hbg.classList.remove('open');
            hbg.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
          });
        });
      
        /* Counter animation */
        function animCount(el) {
          const target = parseFloat(el.dataset.count);
          const isDecimal = el.dataset.decimal !== undefined;
          const decVal = isDecimal ? parseFloat(el.dataset.decimal) : 0;
          const fullTarget = isDecimal ? parseFloat(target + '.' + el.dataset.decimal) : target;
          const suffix = el.dataset.suffix || '';
          const dur = 2000;
          const start = performance.now();
          const step = (now) => {
            const pct = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - pct, 3);
            const val = eased * fullTarget;
            el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val) + (pct >= 1 ? suffix : '');
            if (pct < 1) requestAnimationFrame(step);
            else el.textContent = isDecimal ? fullTarget.toFixed(1) : fullTarget + suffix;
          };
          requestAnimationFrame(step);
        }
      
        /* Intersection Observer — scroll reveals + counters */
        let countersRan = false;
        const rvObs = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              rvObs.unobserve(e.target);
            }
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      
        document.querySelectorAll('.rv').forEach(el => rvObs.observe(el));
      
        const cntObs = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting && !countersRan) {
              countersRan = true;
              document.querySelectorAll('[data-count]').forEach(animCount);
            }
          });
        }, { threshold: 0.3 });
        const numsEl = document.getElementById('hstats');
        if (numsEl) cntObs.observe(numsEl);

        // ── pcards del landing → llevan al registro/login (Patrón A) ──
        document.querySelectorAll('.pcrd[data-tier]').forEach(card => {
          card.style.cursor = 'pointer';
          card.addEventListener('click', () => {
            window.location.href = '/login';
          });
        });

        // ── Modal "¿Cómo funciona?" ──
        const hiw = document.getElementById('hiw');
        const hiwOpen = document.getElementById('b2b-steps');
        const hiwClose = document.getElementById('hiw-close');
        if (hiw && hiwOpen) {
          const openHiw = () => { hiw.hidden = false; document.body.classList.add('hiw-open'); hiwClose && hiwClose.focus(); };
          const closeHiw = () => { hiw.hidden = true; document.body.classList.remove('hiw-open'); hiwOpen.focus(); };
          hiwOpen.addEventListener('click', openHiw);
          hiwClose && hiwClose.addEventListener('click', closeHiw);
          hiw.addEventListener('click', (e) => { if (e.target === hiw) closeHiw(); });
          document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !hiw.hidden) closeHiw(); });
        }

        // ── Modales del footer (Contacto / Privacidad / Términos) ──
        const docModals = ['m-contacto', 'm-privacidad', 'm-terminos'];
        const closeOv = (ov, opener) => {
          ov.hidden = true;
          if (!document.querySelector('.hiw-overlay:not([hidden])')) document.body.classList.remove('hiw-open');
          opener && opener.focus();
        };
        document.querySelectorAll('[data-modal]').forEach((op) => {
          op.addEventListener('click', (e) => {
            e.preventDefault();
            const ov = document.getElementById(op.getAttribute('data-modal'));
            if (!ov) return;
            ov.hidden = false;
            document.body.classList.add('hiw-open');
            const c = ov.querySelector('.hiw-close');
            c && c.focus();
            ov._opener = op;
          });
        });
        docModals.forEach((id) => {
          const ov = document.getElementById(id);
          if (!ov) return;
          ov.querySelector('.hiw-close').addEventListener('click', () => closeOv(ov, ov._opener));
          ov.addEventListener('click', (e) => { if (e.target === ov) closeOv(ov, ov._opener); });
        });
        document.addEventListener('keydown', (e) => {
          if (e.key !== 'Escape') return;
          docModals.forEach((id) => {
            const ov = document.getElementById(id);
            if (ov && !ov.hidden) closeOv(ov, ov._opener);
          });
        });

        // Contacto → arma el mensaje y abre WhatsApp
        const cform = document.getElementById('cform');
        if (cform) {
          cform.addEventListener('submit', (e) => {
            e.preventDefault();
            const n = document.getElementById('cf-nombre').value.trim();
            const m = document.getElementById('cf-motivo').value;
            const t = document.getElementById('cf-msg').value.trim();
            const asunto = m + (n ? ' — ' + n : '');
            const cuerpo = 'Nombre: ' + n + '\nMotivo: ' + m + '\n\n' + t;
            window.location.href = 'mailto:soporte@enmalinalco.com?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
          });
        }

      })();
    };
    run();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} />
    </>
  );
}
