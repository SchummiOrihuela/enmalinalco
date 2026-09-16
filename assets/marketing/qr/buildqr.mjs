import fs from 'fs';
const {size:n, matrix} = JSON.parse(fs.readFileSync('./qr.json','utf8'));
const INK='#1B1409', BG='#F9F7F2';
const cell=10, quiet=4, dim=(n+quiet*2)*cell, off=quiet*cell;
const inFinder=(r,c)=>{const f=(br,bc)=>r>=br&&r<br+7&&c>=bc&&c<bc+7;return f(0,0)||f(0,n-7)||f(n-7,0);};
let dots='';
for(let r=0;r<n;r++)for(let c=0;c<n;c++){
  if(!matrix[r][c]||inFinder(r,c))continue;
  const x=off+c*cell,y=off+r*cell;
  dots+=`<rect x="${x}" y="${y}" width="${cell+0.4}" height="${cell+0.4}" rx="${cell*0.18}" fill="${INK}"/>`;
}
// Finder: 7x7 tinta redondeado, 5x5 crema, 3x3 tinta — alineado a módulos
function finder(br,bc){
  const x=off+bc*cell,y=off+br*cell;
  const s7=7*cell,s5=5*cell,s3=3*cell;
  return `
   <rect x="${x}" y="${y}" width="${s7}" height="${s7}" rx="${s7*0.28}" fill="${INK}"/>
   <rect x="${x+cell}" y="${y+cell}" width="${s5}" height="${s5}" rx="${s5*0.26}" fill="${BG}"/>
   <rect x="${x+2*cell}" y="${y+2*cell}" width="${s3}" height="${s3}" rx="${s3*0.28}" fill="${INK}"/>`;
}
const finders=finder(0,0)+finder(0,n-7)+finder(n-7,0);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${dim}" height="${dim}" shape-rendering="geometricPrecision"><rect width="${dim}" height="${dim}" fill="${BG}"/>${dots}${finders}</svg>`;
fs.writeFileSync('./qr-code.svg',svg);
console.log('QR regenerado');
