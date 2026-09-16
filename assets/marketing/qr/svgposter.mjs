import fs from 'fs';
import sharp from 'sharp';
// QR: quitar wrapper <svg>..</svg>, quedarnos con el contenido
let qr = fs.readFileSync('./qr-code.svg','utf8');
qr = qr.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
// El QR trae un rect de fondo crema 370x370 (incluye quiet zone). Lo dejamos.
const W=1080,H=1440,cx=W/2;
const INK='#1B1409',PARCH='#F3EEE4',SURF='#F9F7F2',ORO='#DCB24A',VERDE='#7CB689',VERDE_LT='#A8D6B0';
const SERIF='Cormorant Garamond', SANS='Plus Jakarta Sans';
// QR card
const cardW=560,cardH=560,cardX=cx-cardW/2,cardY=560;
const qrTarget=440, qrScale=qrTarget/370, qrX=cardX+(cardW-qrTarget)/2, qrY=cardY+(cardH-qrTarget)/2;
// corner marks
function corner(x,y,rot){return `<path d="M0 26 L0 6 Q0 0 6 0 L26 0" fill="none" stroke="${ORO}" stroke-width="4" transform="translate(${x} ${y}) rotate(${rot})"/>`}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#22462f"/><stop offset="0.46" stop-color="#1C3B28"/><stop offset="1" stop-color="#173021"/>
  </linearGradient>
  <radialGradient id="glow1" cx="0.82" cy="-0.08" r="0.7"><stop offset="0" stop-color="#7CB689" stop-opacity="0.20"/><stop offset="0.6" stop-color="#7CB689" stop-opacity="0"/></radialGradient>
  <radialGradient id="glow2" cx="0.02" cy="1.05" r="0.6"><stop offset="0" stop-color="#DCB24A" stop-opacity="0.16"/><stop offset="0.6" stop-color="#DCB24A" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<rect width="${W}" height="${H}" fill="url(#glow1)"/>
<rect width="${W}" height="${H}" fill="url(#glow2)"/>
<rect x="30" y="30" width="${W-60}" height="${H-60}" rx="34" fill="none" stroke="${ORO}" stroke-opacity="0.24" stroke-width="1.5"/>

<!-- brand -->
<text x="${cx}" y="135" text-anchor="middle" font-family="${SERIF}" font-size="52" font-weight="500" fill="${PARCH}">en<tspan font-style="italic" font-weight="600" fill="${VERDE_LT}">malinalco</tspan></text>

<!-- eyebrow -->
<text x="${cx}" y="205" text-anchor="middle" font-family="${SANS}" font-size="21" font-weight="700" letter-spacing="6" fill="${ORO}">GUÍA DEL PUEBLO MÁGICO</text>

<!-- title -->
<text x="${cx}" y="312" text-anchor="middle" font-family="${SERIF}" font-size="82" font-weight="500" fill="${PARCH}">Descubre <tspan font-style="italic" fill="${ORO}">Malinalco</tspan></text>
<text x="${cx}" y="392" text-anchor="middle" font-family="${SERIF}" font-size="82" font-weight="500" fill="${PARCH}">en un toque</text>

<!-- description -->
<g font-family="${SANS}" font-size="27" font-weight="400" fill="${PARCH}" fill-opacity="0.74" text-anchor="middle">
  <text x="${cx}" y="465">Los mejores lugares para comer, dormir,</text>
  <text x="${cx}" y="503">comprar y vivir el pueblo — hoteles,</text>
  <text x="${cx}" y="541">restaurantes, artesanos y rincones con encanto.</text>
</g>

<!-- QR card -->
<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="40" fill="${SURF}"/>
<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="40" fill="none" stroke="#000" stroke-opacity="0.06" stroke-width="1"/>
<g transform="translate(${qrX} ${qrY}) scale(${qrScale})">${qr}</g>
${corner(cardX-14,cardY-14,0)}${corner(cardX+cardW+14,cardY-14,90)}
${corner(cardX+cardW+14,cardY+cardH+14,180)}${corner(cardX-14,cardY+cardH+14,270)}

<!-- scan line -->
<circle cx="${cx-205}" cy="1197" r="7" fill="${VERDE}"/>
<text x="${cx-186}" y="1205" text-anchor="start" font-family="${SANS}" font-size="25" font-weight="600" fill="${PARCH}">Abre tu cámara y apunta aquí</text>

<!-- url pill -->
<rect x="${cx-185}" y="1240" width="370" height="66" rx="33" fill="${ORO}"/>
<text x="${cx+16}" y="1283" text-anchor="middle" font-family="${SANS}" font-size="31" font-weight="700" fill="#25201A">enmalinalco.com</text>
<g transform="translate(${cx-150} 1257)" stroke="#25201A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 15a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></g>

<!-- hint -->
<text x="${cx}" y="1372" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="34" fill="${PARCH}" fill-opacity="0.58">Escanéame y descubre todo Malinalco.</text>
<rect x="${cx-26}" y="1398" width="52" height="3" rx="2" fill="${ORO}" fill-opacity="0.55"/>
</svg>`;
fs.writeFileSync('./qr-poster.svg',svg);
await sharp(Buffer.from(svg),{density:200}).jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile('./qr-poster.jpg');
console.log('JPG listo');
