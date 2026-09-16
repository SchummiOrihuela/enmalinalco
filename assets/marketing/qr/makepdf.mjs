import fs from 'fs';
import sharp from 'sharp';
import PDFDocument from 'pdfkit';
const jobs=[['qr-poster.svg','qr-poster.pdf'],['qr-square.svg','qr-square.pdf'],['qr-story.svg','qr-story.pdf']];
for(const [svg,pdf] of jobs){
  const png='/tmp/_p.png';
  await sharp(svg,{density:300}).png().toFile(png);
  const meta=await sharp(png).metadata();
  const pt=px=>px*72/300;               // 300 DPI -> puntos
  const w=pt(meta.width), h=pt(meta.height);
  const doc=new PDFDocument({size:[w,h],margin:0});
  const stream=fs.createWriteStream(pdf);
  doc.pipe(stream);
  doc.image(png,0,0,{width:w,height:h});
  doc.end();
  await new Promise(r=>stream.on('finish',r));
  console.log(pdf, `${meta.width}x${meta.height}px @300dpi`);
}
