import fs from 'fs';
const qr = fs.readFileSync('./qr-code.svg','utf8');
const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QR · enmalinalco</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#1B1409;--parch:#F3EEE4;--surf:#F9F7F2;--selva:#1C3B28;
  --verde:#7CB689;--verde-lt:#A8D6B0;--terra:#DE6A3E;--oro:#DCB24A;
  --display:'Cormorant Garamond',Georgia,serif;--body:'Plus Jakarta Sans',system-ui,sans-serif;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--body);background:#14251b;display:flex;justify-content:center;
  padding:34px 18px;min-height:100vh;-webkit-font-smoothing:antialiased}
.poster{position:relative;width:100%;max-width:560px;border-radius:30px;overflow:hidden;
  background:
    radial-gradient(120% 80% at 82% -8%, rgba(124,182,137,.18), transparent 55%),
    radial-gradient(100% 70% at 0% 108%, rgba(220,178,74,.14), transparent 55%),
    linear-gradient(178deg,#22462f 0%,#1C3B28 46%,#173021 100%);
  box-shadow:0 26px 70px rgba(0,0,0,.5);padding:44px 40px 38px;color:var(--parch);
  border:1px solid rgba(220,178,74,.16)}
/* marco dorado interior */
.poster::after{content:'';position:absolute;inset:16px;border:1px solid rgba(220,178,74,.22);
  border-radius:20px;pointer-events:none}
.inner{position:relative;z-index:1;text-align:center}
.brand{font-family:var(--display);font-size:24px;font-weight:500;letter-spacing:.01em;color:var(--parch);margin-bottom:26px}
.brand em{font-style:italic;color:var(--verde-lt);font-weight:600}
.eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.28em;color:var(--oro);margin-bottom:16px}
.title{font-family:var(--display);font-size:clamp(2.3rem,1.5rem+4vw,3.1rem);font-weight:500;line-height:1.02;color:var(--parch);margin-bottom:14px}
.title em{font-style:italic;color:var(--oro)}
.desc{font-size:14.5px;line-height:1.6;color:rgba(243,238,228,.72);max-width:360px;margin:0 auto 30px}
/* tarjeta QR */
.qr-card{position:relative;width:288px;height:288px;margin:0 auto;background:var(--surf);
  border-radius:26px;padding:18px;box-shadow:0 14px 40px rgba(0,0,0,.34);display:flex;align-items:center;justify-content:center}
.qr-card svg{width:100%;height:100%;display:block}
/* esquinas doradas decorativas */
.corner{position:absolute;width:26px;height:26px;border:2.5px solid var(--oro);opacity:.85}
.corner.tl{top:-9px;left:-9px;border-right:none;border-bottom:none;border-radius:8px 0 0 0}
.corner.tr{top:-9px;right:-9px;border-left:none;border-bottom:none;border-radius:0 8px 0 0}
.corner.bl{bottom:-9px;left:-9px;border-right:none;border-top:none;border-radius:0 0 0 8px}
.corner.br{bottom:-9px;right:-9px;border-left:none;border-top:none;border-radius:0 0 8px 0}
/* cta */
.scan{display:inline-flex;align-items:center;gap:10px;margin-top:30px;font-size:13px;font-weight:600;
  letter-spacing:.02em;color:var(--parch)}
.scan svg{stroke:var(--oro)}
.pulse{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--verde);
  box-shadow:0 0 0 0 rgba(124,182,137,.7);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(124,182,137,.6)}70%{box-shadow:0 0 0 12px rgba(124,182,137,0)}100%{box-shadow:0 0 0 0 rgba(124,182,137,0)}}
.url{margin-top:20px;display:inline-flex;align-items:center;gap:9px;padding:11px 26px;
  background:linear-gradient(180deg,#E7C86A,#DCB24A);color:#25201A;border-radius:9999px;
  font-size:16px;font-weight:700;letter-spacing:.01em;box-shadow:0 6px 18px rgba(220,178,74,.3)}
.hint{margin-top:18px;font-size:12px;color:rgba(243,238,228,.5);font-style:italic;font-family:var(--display);font-size:15px}
.divider{width:44px;height:2px;background:var(--oro);opacity:.5;margin:22px auto 0;border-radius:2px}
@media print{body{background:#fff;padding:0}.poster{box-shadow:none;max-width:none}}
</style></head>
<body>
  <div class="poster"><div class="inner">
    <div class="brand">en<em>malinalco</em></div>
    <p class="eyebrow">Guía del Pueblo Mágico</p>
    <h1 class="title">Descubre <em>Malinalco</em><br>en un toque</h1>
    <p class="desc">Los mejores lugares para comer, dormir, comprar y vivir el pueblo — hoteles, restaurantes, artesanos y rincones con encanto, todos en un solo lugar.</p>

    <div class="qr-card">
      <span class="corner tl"></span><span class="corner tr"></span>
      <span class="corner bl"></span><span class="corner br"></span>
      ${qr}
    </div>

    <div class="scan">
      <span class="pulse"></span>
      Abre tu cámara y apunta aquí
    </div>

    <div><span class="url">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      enmalinalco.com
    </span></div>

    <p class="hint">Escanéame y descubre todo Malinalco.</p>
    <div class="divider"></div>
  </div></div>
</body></html>`;
fs.writeFileSync('./qr-poster.html', html);
console.log('poster listo:', html.length, 'bytes');
