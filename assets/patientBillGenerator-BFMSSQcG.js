import{t as e}from"./jspdf.es.min-7ycUzo4q.js";import{S as t,n}from"./index-DG33V1Vg.js";var r={name:`arrow-left`,size:24,node:[[`path`,{d:`m12 19-7-7 7-7`,key:`1l729n`}],[`path`,{d:`M19 12H5`,key:`x3x0zl`}]]};r.node;var i=t(r),a={widthMm:210,heightMm:297,marginLeftMm:10,marginTopMm:10,marginRightMm:10,boxWidthMm:190,boxHeightMm:152};function o(e,t=!1){if(!e)return s(new Date,t);try{let n=new Date(e);return isNaN(n.getTime())?e:s(n,t)}catch{return e}}function s(e,t){let n=`${String(e.getDate()).padStart(2,`0`)}-${[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`][e.getMonth()]}-${e.getFullYear()}`;if(!t)return n;let r=e.getHours(),i=String(e.getMinutes()).padStart(2,`0`),a=String(e.getSeconds()).padStart(2,`0`),o=r>=12?`PM`:`AM`;return r%=12,r||=12,`${n} ${String(r).padStart(2,`0`)}:${i}:${a} ${o}`}function c(t){let r=new e({orientation:`portrait`,unit:`mm`,format:`a4`}),i=a.marginLeftMm,s=a.marginTopMm,c=a.boxWidthMm,l=a.boxHeightMm;r.setDrawColor(50,50,50),r.setLineWidth(.35),r.rect(i,s,c,l);let u=s+7;r.setFont(`helvetica`,`bold`),r.setFontSize(16),r.setTextColor(25,25,25),r.text(n.name||`XYZ`,i+c/2,u,{align:`center`}),n.subTitle&&(u+=4.5,r.setFont(`helvetica`,`bold`),r.setFontSize(8.5),r.setTextColor(40,40,40),r.text(n.subTitle,i+c/2,u,{align:`center`})),n.managedBy&&(u+=3.8,r.setFont(`helvetica`,`normal`),r.setFontSize(7.5),r.setTextColor(60,60,60),r.text(n.managedBy,i+c/2,u,{align:`center`})),n.cinNo&&(u+=3.5,r.setFontSize(7),r.text(`CIN No. - ${n.cinNo}`,i+c/2,u,{align:`center`})),u+=4,r.setFont(`helvetica`,`normal`),r.setFontSize(7.2),r.setTextColor(50,50,50),r.text(n.address||`XYZ`,i+c/2,u,{align:`center`}),u+=3.2,r.text(`Ph: ${n.phone||`XYZ`}  |  E-mail: ${n.email||`XYZ`}`,i+c/2,u,{align:`center`}),u+=4.2,r.setDrawColor(60,60,60),r.setLineWidth(.3),r.line(i,u,i+c,u);let d=6.2;r.setFillColor(225,228,232),r.rect(i,u,c,d,`F`),r.setFont(`helvetica`,`bold`),r.setFontSize(10.5),r.setTextColor(20,20,20),r.text(`BILL CUM RECEIPT`,i+c/2,u+4.5,{align:`center`}),u+=d,r.line(i,u,i+c,u);let f=i+3,p=i+27,m=i+138,h=i+160,g=(t.patientName||`UNKNOWN PATIENT`).toUpperCase(),_=(t.age||``).trim(),v=(t.ageUnit||`Yrs.`).trim(),y=_?`${_} ${v}`:`N/A`,b=(t.sex||`N/A`).trim(),x=(t.mobile||``).trim()||`N/A`,S=(t.treatingDoctor||`Dr. NILESH MAHALE`).toUpperCase(),C=(t.referenceDoctor||`---`).toUpperCase()||`---`,w=t.uhid||t.patientId||``,T=t.invoiceNo||``,E=o(t.billDate||t.createdAt),D=u+4;r.setFont(`helvetica`,`bold`),r.setFontSize(8),r.setTextColor(30,30,30),r.text(`Name`,f,D),r.text(`:`,p-3,D),r.setFont(`helvetica`,`bold`),r.setFontSize(8.2),r.text(g.substring(0,52),p,D),r.setFont(`helvetica`,`bold`),r.setFontSize(8),r.text(`UHID`,m,D),r.text(`:`,h-3,D),r.text(w,h,D),D+=4.5,r.text(`Age / Sex`,f,D),r.text(`:`,p-3,D),r.setFont(`helvetica`,`normal`),r.text(`${y} / ${b}`,p,D),r.setFont(`helvetica`,`bold`),r.text(`Mobile :`,p+34,D),r.setFont(`helvetica`,`normal`),r.text(x,p+48,D),r.setFont(`helvetica`,`bold`),r.text(`Invoice No.`,m,D),r.text(`:`,h-3,D),r.text(T,h,D),D+=4.5,r.text(`Treating Dr`,f,D),r.text(`:`,p-3,D),r.setFont(`helvetica`,`normal`),r.setFontSize(7.8),r.text(S.substring(0,52),p,D),r.setFont(`helvetica`,`bold`),r.setFontSize(8),r.text(`Date`,m,D),r.text(`:`,h-3,D),r.setFont(`helvetica`,`normal`),r.text(E,h,D),D+=4.5,r.setFont(`helvetica`,`bold`),r.text(`Reference Dr`,f,D),r.text(`:`,p-3,D),r.setFont(`helvetica`,`normal`),r.setFontSize(7.8),r.text(C.substring(0,52),p,D),u=D+5.5,r.line(i,u,i+c,u);let O=u;r.setFont(`helvetica`,`bold`),r.setFontSize(8.2),r.text(`Sr. No.`,i+9,O+4,{align:`center`}),r.text(` Details`,i+18,O+4),r.text(`Rate   `,i+c-3,O+4,{align:`right`}),O+=5.5,r.line(i,O,i+c,O);let k=t.items&&t.items.length>0?t.items:[{srNo:1,details:`OPD Consultation / Registration Charge`,rate:500,amount:500}];r.setFont(`helvetica`,`normal`),r.setFontSize(8);for(let e of k){let t=Number(e.rate||e.amount||0),n=Number.isInteger(t)?t.toFixed(0):t.toFixed(2);r.text(String(e.srNo||1),i+9,O+4,{align:`center`}),r.text(` ${e.details}`,i+18,O+4),r.text(`${n}   `,i+c-3,O+4,{align:`right`}),O+=5.2}O=Math.max(O,u+16),r.line(i,O,i+c,O);let A=O+1.5,j=i+3,M=A,N=24.5;r.rect(j,M,126,N),r.setFont(`helvetica`,`bold`),r.setFontSize(7.2),r.text(` Rec.Date`,j+1,M+3.5),r.text(`Receipt No`,j+19,M+3.5),r.text(`Amt.`,j+43,M+3.5,{align:`right`}),r.text(`Payment Type`,j+56,M+3.5,{align:`center`}),r.text(`User`,j+78,M+3.5);let P=o(t.billDate||t.createdAt),F=Number(t.amountReceived||0),I=Number.isInteger(F)?F.toFixed(0):F.toFixed(2),L=t.paymentType||`Cash`,R=t.entryBy||`Jenil Bundela`,z=t.pcName||`RECEPTION1`,B=o(t.billDate||t.createdAt,!0),V=M+7.5;r.setFont(`helvetica`,`normal`),r.setFontSize(7),r.text(` ${P}`,j+1,V),r.text(t.receiptNo||T,j+19,V),r.text(I,j+43,V,{align:`right`}),r.text(L,j+56,V,{align:`center`}),r.text(`EntryBy:${R},`,j+78,V),r.text(`PCName:${z},`,j+78,V+3.2),r.text(`At:${B}.`,j+78,V+6.4),r.line(j+30,V+9.5,j+45,V+9.5),r.setFont(`helvetica`,`bold`),r.setFontSize(7.5),r.text(I,j+43,V+13,{align:`right`});let H=Number(t.totalAmount||0),U=Number(t.dueAmount||0),W=Number.isInteger(H)?H.toFixed(0):H.toFixed(2),G=Number.isInteger(U)?U.toFixed(0):U.toFixed(2),K=i+138,q=i+165,J=A+4.5;r.setFont(`helvetica`,`bold`),r.setFontSize(8.2),r.text(`Total`,K,J),r.text(`:`,q-3,J),r.text(W,q+18,J,{align:`right`}),J+=5,r.text(`Received`,K,J),r.text(`:`,q-3,J),r.text(I,q+18,J,{align:`right`}),J+=12,r.setFontSize(9),r.text(`Due`,K,J),r.text(`:`,q-3,J),r.text(G,q+18,J,{align:`right`});let Y=M+N+4;return r.setFont(`helvetica`,`normal`),r.setFontSize(7),r.setTextColor(50,50,50),r.text(`Subject to SURAT Jurisdiction`,i+3,Y),r.text(`Payment by cheque Subject To Realization`,i+3,Y+3.5),r.text(`EntryBy:${R}, PCName:${z}, At:${B}.`,i+3,Y+7),r.setFont(`helvetica`,`bold`),r.setFontSize(7.5),r.text(`Authorized Signatory`,i+c-25,Y+6,{align:`center`}),r.output(`blob`)}async function l(e,t){let n=window.open(`about:blank`,`_blank`);n&&n.document.write(`
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
    `);try{let r=``;if(t)try{(await fetch(t,{method:`HEAD`})).ok&&(r=t)}catch{}if(!r){let t=c(e);r=URL.createObjectURL(t)}n?n.location.href=r:window.open(r,`_blank`)}catch(e){n&&(n.document.body.innerHTML=`
        <div style="padding: 24px; text-align: center; color: #b91c1c; font-family: sans-serif;">
          <h3>Failed to Generate Bill PDF</h3>
          <p>${e instanceof Error?e.message:`An unexpected error occurred.`}</p>
        </div>
      `)}}export{l as n,i as r,o as t};