import QRCode from 'qrcode';
const qr = QRCode.create('https://enmalinalco.com', { errorCorrectionLevel:'H' });
const n = qr.modules.size;
const data = qr.modules.data;
const m = [];
for(let r=0;r<n;r++){ const row=[]; for(let c=0;c<n;c++) row.push(data[r*n+c]?1:0); m.push(row); }
console.log(JSON.stringify({size:n, matrix:m}));
