import fs from 'fs';
import sharp from 'sharp';
let qr = fs.readFileSync('./qr-code.svg','utf8').replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const INK='#1B1409',PARCH='#F3EEE4',SURF='#F9F7F2',ORO='#DCB24A',VERDE='#7CB689',VERDE_LT='#A8D6B0';
const SERIF='Cormorant Garamond',SANS='Plus Jakarta Sans';

function corner(x,y,rot){return `<path d="M0 30 L0 7 Q0 0 7 0 L30 0" fill="none" stroke="${ORO}" stroke-width="4.5" transform="translate(${x} ${y}) rotate(${rot})"/>`}

function build(cfg){
  const {W,H,brandY,brandSz,eyeY,eyeSz,eyeLs,titleY1,titleY2,titleSz,desc,descY,descSz,cardSz,cardY,scanY,scanSz,pillY,pillW,pillH,pillSz,hintY,hintSz,divY}=cfg;
  const cx=W/2, cardX=cx-cardSz/2;
  const qrTarget=cardSz*0.78, qrScale=qrTarget/370, qrX=cardX+(cardSz-qrTarget)/2, qrY=cardY+(cardSz-qrTarget)/2;
  const descLines=desc.map((t,i)=>`<text x="${cx}" y="${descY+i*(descSz*1.42)}">${t}</text>`).join('');
  const scanText='Abre tu cámara y apunta aquí';
  const scanTextW=scanText.length*scanSz*0.52;
  const dotX=cx-scanTextW/2-26, txtX=dotX+22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22462f"/><stop offset="0.46" stop-color="#1C3B28"/><stop offset="1" stop-color="#173021"/></linearGradient>
  <radialGradient id="g1" cx="0.82" cy="-0.06" r="0.7"><stop offset="0" stop-color="#7CB689" stop-opacity="0.20"/><stop offset="0.6" stop-color="#7CB689" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="0.03" cy="1.05" r="0.6"><stop offset="0" stop-color="#DCB24A" stop-opacity="0.15"/><stop offset="0.6" stop-color="#DCB24A" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#g1)"/><rect width="${W}" height="${H}" fill="url(#g2)"/>
<rect x="26" y="26" width="${W-52}" height="${H-52}" rx="32" fill="none" stroke="${ORO}" stroke-opacity="0.22" stroke-width="1.5"/>
<text x="${cx}" y="${brandY}" text-anchor="middle" font-family="${SERIF}" font-size="${brandSz}" font-weight="500" fill="${PARCH}">en<tspan font-style="italic" font-weight="600" fill="${VERDE_LT}">malinalco</tspan></text>
<text x="${cx}" y="${eyeY}" text-anchor="middle" font-family="${SANS}" font-size="${eyeSz}" font-weight="700" letter-spacing="${eyeLs}" fill="${ORO}">GUÍA DEL PUEBLO MÁGICO</text>
<text x="${cx}" y="${titleY1}" text-anchor="middle" font-family="${SERIF}" font-size="${titleSz}" font-weight="500" fill="${PARCH}">Descubre <tspan font-style="italic" fill="${ORO}">Malinalco</tspan></text>
<text x="${cx}" y="${titleY2}" text-anchor="middle" font-family="${SERIF}" font-size="${titleSz}" font-weight="500" fill="${PARCH}">en un toque</text>
<g font-family="${SANS}" font-size="${descSz}" font-weight="400" fill="${PARCH}" fill-opacity="0.74" text-anchor="middle">${descLines}</g>
<rect x="${cardX}" y="${cardY}" width="${cardSz}" height="${cardSz}" rx="${cardSz*0.072}" fill="${SURF}"/>
<g transform="translate(${qrX} ${qrY}) scale(${qrScale})">${qr}</g>
${corner(cardX-14,cardY-14,0)}${corner(cardX+cardSz+14,cardY-14,90)}${corner(cardX+cardSz+14,cardY+cardSz+14,180)}${corner(cardX-14,cardY+cardSz+14,270)}
<circle cx="${dotX}" cy="${scanY-scanSz*0.32}" r="${scanSz*0.28}" fill="${VERDE}"/>
<text x="${txtX}" y="${scanY}" text-anchor="start" font-family="${SANS}" font-size="${scanSz}" font-weight="600" fill="${PARCH}">${scanText}</text>
<rect x="${cx-pillW/2}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH/2}" fill="${ORO}"/>
<g transform="translate(${cx-pillW/2+52} ${pillY+pillH/2-11})" stroke="#25201A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 15a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></g>
<text x="${cx+22}" y="${pillY+pillH/2+pillSz*0.34}" text-anchor="middle" font-family="${SANS}" font-size="${pillSz}" font-weight="700" fill="#25201A">enmalinalco.com</text>
<text x="${cx}" y="${hintY}" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="${hintSz}" fill="${PARCH}" fill-opacity="0.58">Escanéame y descubre todo Malinalco.</text>
<rect x="${cx-26}" y="${divY}" width="52" height="3" rx="2" fill="${ORO}" fill-opacity="0.55"/>
</svg>`;
}

const square={W:1080,H:1080,brandY:92,brandSz:44,eyeY:143,eyeSz:18,eyeLs:5,titleY1:222,titleY2:288,titleSz:60,
  desc:['Los mejores lugares para comer, dormir y comprar —','todo Malinalco en un solo lugar.'],descY:344,descSz:23,
  cardSz:400,cardY:410,scanY:880,scanSz:23,pillY:912,pillW:340,pillH:60,pillSz:28,hintY:1005,hintSz:29,divY:1032};

const story={W:1080,H:1920,brandY:250,brandSz:52,eyeY:322,eyeSz:22,eyeLs:6,titleY1:432,titleY2:520,titleSz:88,
  desc:['Los mejores lugares para comer, dormir,','comprar y vivir el pueblo — hoteles,','restaurantes, artesanos y rincones con encanto.'],descY:620,descSz:29,
  cardSz:600,cardY:760,scanY:1520,scanSz:28,pillY:1560,pillW:400,pillH:70,pillSz:33,hintY:1690,hintSz:36,divY:1730};

for(const [name,cfg] of [['square',square],['story',story]]){
  const svg=build(cfg);
  fs.writeFileSync(`./qr-${name}.svg`,svg);
  await sharp(Buffer.from(svg),{density:200}).jpeg({quality:92,chromaSubsampling:'4:4:4'}).toFile(`./qr-${name}.jpg`);
  const {default:jsQR}=await import('jsqr');
  const {data,info}=await sharp(`./qr-${name}.jpg`).raw().ensureAlpha().toBuffer({resolveWithObject:true});
  const c=jsQR(new Uint8ClampedArray(data),info.width,info.height);
  console.log(name, cfg.W+'x'+cfg.H, '→ QR:', c?c.data:'FALLO');
}
