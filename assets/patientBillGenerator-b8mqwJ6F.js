import{t as e}from"./jspdf.es.min-ZtfoGS28.js";import{x as t}from"./index-Byg5JU5v.js";var n={name:`arrow-left`,size:24,node:[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]};n.node;var r=t(n),i={widthMm:210,heightMm:297,marginLeftMm:10,marginTopMm:10,marginRightMm:10,boxWidthMm:190,boxHeightMm:152};function a(e,t=!1){if(!e)return o(new Date,t);try{let n=new Date(e);return isNaN(n.getTime())?e:o(n,t)}catch{return e}}function o(e,t){let n=`${String(e.getDate()).padStart(2,`0`)}-${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][e.getMonth()]}-${e.getFullYear()}`;if(!t)return n;let r=e.getHours(),i=String(e.getMinutes()).padStart(2,`0`),a=String(e.getSeconds()).padStart(2,`0`),o=r>=12?`PM`:`AM`;return r%=12,r||=12,`${n} ${String(r).padStart(2,`0`)}:${i}:${a} ${o}`}function s(t){let n=new e({orientation:`portrait`,unit:`mm`,format:`a4`}),r=i.marginLeftMm,o=i.marginTopMm,s=i.boxWidthMm,c=i.boxHeightMm;n.setDrawColor(50,50,50),n.setLineWidth(.35),n.rect(r,o,s,c);let l=o+7;n.setFont(`helvetica`,`bold`),n.setFontSize(16),n.setTextColor(25,25,25),n.text(`UNICARE`,r+s/2,l,{align:`center`}),l+=4.5,n.setFont(`helvetica`,`bold`),n.setFontSize(8.5),n.setTextColor(40,40,40),n.text(`HEART INSTITUTE & RESEARCH CENTER`,r+s/2,l,{align:`center`}),l+=3.8,n.setFont(`helvetica`,`normal`),n.setFontSize(7.5),n.setTextColor(60,60,60),n.text(`(Managed By : South Gujarat Cardiac Care Pvt. Ltd.)`,r+s/2,l,{align:`center`}),l+=3.5,n.setFontSize(7),n.text(`CIN No. - U85110GJ2013PTC073815`,r+s/2,l,{align:`center`}),l+=4,n.setFontSize(7.2),n.setTextColor(50,50,50),n.text(`Acme Plaza, B-Wing, Near Sosyo Circle, Behind New Civil Hospital, Canal Road, Surat-395002`,r+s/2,l,{align:`center`}),l+=3.2,n.text(`Ph: 0261-2639700/9800  |  E-mail: unicareheartinstitute@gmail.com`,r+s/2,l,{align:`center`}),l+=4.2,n.setDrawColor(60,60,60),n.setLineWidth(.3),n.line(r,l,r+s,l);let u=6.2;n.setFillColor(225,228,232),n.rect(r,l,s,u,`F`),n.setFont(`helvetica`,`bold`),n.setFontSize(10.5),n.setTextColor(20,20,20),n.text(`BILL CUM RECEIPT`,r+s/2,l+4.5,{align:`center`}),l+=u,n.line(r,l,r+s,l);let d=r+3,f=r+27,p=r+138,m=r+160,h=(t.patientName||`UNKNOWN PATIENT`).toUpperCase(),g=(t.age||``).trim(),_=(t.ageUnit||`Yrs.`).trim(),v=g?`${g} ${_}`:`N/A`,y=(t.sex||`N/A`).trim(),b=(t.mobile||``).trim()||`N/A`,x=(t.treatingDoctor||`Dr. NILESH MAHALE`).toUpperCase(),S=(t.referenceDoctor||`---`).toUpperCase()||`---`,C=t.uhid||t.patientId||``,w=t.invoiceNo||``,T=a(t.billDate||t.createdAt),E=l+4;n.setFont(`helvetica`,`bold`),n.setFontSize(8),n.setTextColor(30,30,30),n.text(`Name`,d,E),n.text(`:`,f-3,E),n.setFont(`helvetica`,`bold`),n.setFontSize(8.2),n.text(h.substring(0,52),f,E),n.setFont(`helvetica`,`bold`),n.setFontSize(8),n.text(`UHID`,p,E),n.text(`:`,m-3,E),n.text(C,m,E),E+=4.5,n.text(`Age / Sex`,d,E),n.text(`:`,f-3,E),n.setFont(`helvetica`,`normal`),n.text(`${v} / ${y}`,f,E),n.setFont(`helvetica`,`bold`),n.text(`Mobile :`,f+34,E),n.setFont(`helvetica`,`normal`),n.text(b,f+48,E),n.setFont(`helvetica`,`bold`),n.text(`Invoice No.`,p,E),n.text(`:`,m-3,E),n.text(w,m,E),E+=4.5,n.text(`Treating Dr`,d,E),n.text(`:`,f-3,E),n.setFont(`helvetica`,`normal`),n.setFontSize(7.8),n.text(x.substring(0,52),f,E),n.setFont(`helvetica`,`bold`),n.setFontSize(8),n.text(`Date`,p,E),n.text(`:`,m-3,E),n.setFont(`helvetica`,`normal`),n.text(T,m,E),E+=4.5,n.setFont(`helvetica`,`bold`),n.text(`Reference Dr`,d,E),n.text(`:`,f-3,E),n.setFont(`helvetica`,`normal`),n.setFontSize(7.8),n.text(S.substring(0,52),f,E),l=E+5.5,n.line(r,l,r+s,l);let D=l;n.setFont(`helvetica`,`bold`),n.setFontSize(8.2),n.text(`Sr. No.`,r+9,D+4,{align:`center`}),n.text(` Details`,r+18,D+4),n.text(`Rate   `,r+s-3,D+4,{align:`right`}),D+=5.5,n.line(r,D,r+s,D);let O=t.items&&t.items.length>0?t.items:[{srNo:1,details:`OPD Consultation / Registration Charge`,rate:500,amount:500}];n.setFont(`helvetica`,`normal`),n.setFontSize(8);for(let e of O){let t=Number(e.rate||e.amount||0),i=Number.isInteger(t)?t.toFixed(0):t.toFixed(2);n.text(String(e.srNo||1),r+9,D+4,{align:`center`}),n.text(` ${e.details}`,r+18,D+4),n.text(`${i}   `,r+s-3,D+4,{align:`right`}),D+=5.2}D=Math.max(D,l+16),n.line(r,D,r+s,D);let k=D+1.5,A=r+3,j=k,M=24.5;n.rect(A,j,126,M),n.setFont(`helvetica`,`bold`),n.setFontSize(7.2),n.text(` Rec.Date`,A+1,j+3.5),n.text(`Receipt No`,A+19,j+3.5),n.text(`Amt.`,A+43,j+3.5,{align:`right`}),n.text(`Payment Type`,A+56,j+3.5,{align:`center`}),n.text(`User`,A+78,j+3.5);let N=a(t.billDate||t.createdAt),P=Number(t.amountReceived||0),F=Number.isInteger(P)?P.toFixed(0):P.toFixed(2),I=t.paymentType||`Cash`,L=t.entryBy||`Jenil Bundela`,R=t.pcName||`RECEPTION1`,z=a(t.billDate||t.createdAt,!0),B=j+7.5;n.setFont(`helvetica`,`normal`),n.setFontSize(7),n.text(` ${N}`,A+1,B),n.text(t.receiptNo||w,A+19,B),n.text(F,A+43,B,{align:`right`}),n.text(I,A+56,B,{align:`center`}),n.text(`EntryBy:${L},`,A+78,B),n.text(`PCName:${R},`,A+78,B+3.2),n.text(`At:${z}.`,A+78,B+6.4),n.line(A+30,B+9.5,A+45,B+9.5),n.setFont(`helvetica`,`bold`),n.setFontSize(7.5),n.text(F,A+43,B+13,{align:`right`});let V=Number(t.totalAmount||0),H=Number(t.dueAmount||0),U=Number.isInteger(V)?V.toFixed(0):V.toFixed(2),W=Number.isInteger(H)?H.toFixed(0):H.toFixed(2),G=r+138,K=r+165,q=k+4.5;n.setFont(`helvetica`,`bold`),n.setFontSize(8.2),n.text(`Total`,G,q),n.text(`:`,K-3,q),n.text(U,K+18,q,{align:`right`}),q+=5,n.text(`Received`,G,q),n.text(`:`,K-3,q),n.text(F,K+18,q,{align:`right`}),q+=12,n.setFontSize(9),n.text(`Due`,G,q),n.text(`:`,K-3,q),n.text(W,K+18,q,{align:`right`});let J=j+M+4;return n.setFont(`helvetica`,`normal`),n.setFontSize(7),n.setTextColor(50,50,50),n.text(`Subject to SURAT Jurisdiction`,r+3,J),n.text(`Payment by cheque Subject To Realization`,r+3,J+3.5),n.text(`EntryBy:${L}, PCName:${R}, At:${z}.`,r+3,J+7),n.setFont(`helvetica`,`bold`),n.setFontSize(7.5),n.text(`Authorized Signatory`,r+s-25,J+6,{align:`center`}),n.output(`blob`)}async function c(e,t){let n=window.open(`about:blank`,`_blank`);n&&n.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Generating Bill - ${e.invoiceNo}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f8fafc;
              color: #334155;
            }
            .spinner {
              width: 38px;
              height: 38px;
              border: 3px solid #cbd5e1;
              border-top-color: #0d9488;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin-bottom: 16px;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <p style="font-weight: 600; font-size: 1.05rem; margin-bottom: 4px;">Preparing Bill & Receipt (${e.invoiceNo})...</p>
          <p style="font-size: 0.85rem; color: #64748b;">Generating printable A4 bill for ${e.patientName} (${e.uhid})</p>
        </body>
      </html>
    `);try{let r=``;if(t)try{(await fetch(t,{method:`HEAD`})).ok&&(r=t)}catch{}if(!r){let t=s(e);r=URL.createObjectURL(t)}n?n.location.href=r:window.open(r,`_blank`)}catch(e){n&&(n.document.body.innerHTML=`
        <div style="padding: 24px; text-align: center; color: #b91c1c; font-family: sans-serif;">
          <h3>Failed to Generate Bill PDF</h3>
          <p>${e instanceof Error?e.message:`An unexpected error occurred.`}</p>
        </div>
      `)}}export{c as n,r,a as t};