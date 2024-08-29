Office.onReady((e=>{console.log(`%c Flex365x Outlook Addin: ${getBuildDateString()} A`,"background: #555; color: #fff; padding: 3px;"),console.log("taskpane ready"),Office.context.mailbox.addHandlerAsync(Office.EventType.ItemChanged,itemChanged),document.querySelector("#flex-init").style.display="none",updateReadUI()}));const getBuildDateString=()=>{const e=new Date(111111);return["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][e.getMonth()]+" "+e.getDate().toString()+" "+e.getFullYear().toString()+" "+(e.getHours()<10?"0":"")+e.getHours().toString()+":"+(e.getMinutes()<10?"0":"")+e.getMinutes().toString()},openFlexSite=e=>{window.open(`https://44g7q3.sharepoint.com/sites/Flex/SitePages/CollabHome.aspx?sw=bypass&search=${e}`)},getEMLFile=e=>{let t="";const n=(e,t)=>{let n="";const a=[];let r=0,i="";do{i=e.substr(r,t),""!==i&&a.push(i),r+=t}while(""!==i);return a.length>-1&&(n=a.join("\r\n")),n};t+=`To: ${e.to}\r\nFrom: ${e.sender}\r\nCC: ${e.cc}\r\nSubject: ${e.subject}\r\nDate: ${e.date}\r\n`,t+="Content-Type: multipart/mixed; boundary=--boundary_text_string\r\n",t+="\r\n----boundary_text_string\r\nContent-Type: text/html; charset=ISO-8859-1\r\n",t+="Content-Transfer-Encoding: quoted-printable\r\n\r\n",t+=`<html><head></head><body>${e.body}</body></html>`;for(const a of e.attachments)t+="\r\n\r\n----boundary_text_string\r\n",t+=`Content-Type: ${a.contentType}; name="${a.name}"\r\n`,t+=`Content-Disposition: attachment; filename="${a.name}"; size=${a.size.toString()}\r\n`,t+="Content-Transfer-Encoding: base64\r\n\r\n",t+=`${n(a.base64Content,76)}`;return t+="\r\n\r\n----boundary_text_string--",t},readDragger=e=>{e.dataTransfer.setData("text",JSON.stringify({to:theMailItem.to,sender:theMailItem.sender,subject:theMailItem.subject,date:theMailItem.date,cc:theMailItem.cc,body:theMailItem.body,numAttachments:theMailItem.attachments.length.toString(),filename:`${theMailItem.subject.replace(/[^a-z0-9+]+/gi,"_")}_${(new Date).getMilliseconds().toString()}${Math.floor(1e3*Math.random())}.eml`,eml:getEMLFile(theMailItem)}))},getAttachment=(e,t)=>new Promise<Office.AsyncResult<Office.AttachmentContent>>((n,a)=>{e.getAttachmentContentAsync(t,null,(e=>{e.status===Office.AsyncResultStatus.Succeeded?n(e):a(e)}))}),updateReadUI=()=>{console.log("updateReadUI called");const e=document.querySelector("#flex-app-body"),t=document.querySelector("#flex-select-item-prompt"),n=document.querySelector("#flex-wait"),a=document.querySelector("#flex-search-to-container"),r=document.querySelector("#flex-search-link-sender-name"),i=document.querySelector("#flex-search-link-sender-address");if(!(a&&r&&i&&e&&t&&n))return;e.style.display="none",t.style.display="none",n.style.display="flex",a.replaceChildren(),r.replaceChildren(),i.replaceChildren();const l=Office.context.mailbox.item,o={to:"",sender:"",subject:"",date:"",cc:"",body:"",attachments:[]};if(!l)return n.style.display="none",void(t.style.display="flex");o.sender=getEmailString(l.sender),o.date=`${l.dateTimeCreated.toUTCString()}`,l.to.forEach((e=>{o.to+=(o.to.length>0?"; ":"")+getEmailString(e)})),l.cc.forEach((e=>{o.cc+=(o.cc.length>0?"; ":"")+getEmailString(e)})),o.subject=l.subject,l.body.getAsync(Office.CoercionType.Html,null,(async a=>{o.body=a.value;for(const e of l.attachments)try{const t=await getAttachment(l,e.id);o.attachments.push({id:e.id,name:e.name,contentType:e.contentType,size:e.size,base64Content:t.value.content})}catch(e){console.log("error caught"),console.log(e)}theMailItem=Object.assign({},o);const s=document.querySelector("#flex-drag-envelope");s&&s.addEventListener("dragstart",readDragger);const d=document.createElement("a");d.href="javascript:void(0)",d.innerText=l.sender.displayName,d.addEventListener("click",(()=>openFlexSite(`${l.sender.displayName}`))),r.replaceChildren(),r.append(d);const c=document.createElement("a");c.href="javascript:void(0)",c.innerText=l.sender.emailAddress,c.addEventListener("click",(()=>openFlexSite(`${l.sender.emailAddress}`))),i.replaceChildren(),i.append(c);const m=document.querySelector("#flex-search-to-container");m&&(m.replaceChildren(),l.to.forEach((e=>{if(e.emailAddress!==l.sender.emailAddress){const t=document.createElement("div"),n=document.createElement("a");if(n.href="javascript:void(0)",n.innerHTML=`${e.displayName}`,n.addEventListener("click",(()=>openFlexSite(`${n.innerHTML}`))),t.appendChild(n),m.children.length>0&&(t.style.paddingTop="10px"),m.appendChild(t),e.displayName!==e.emailAddress){const t=document.createElement("div"),n=document.createElement("a");n.href="javascript:void(0)",n.innerHTML=`${e.emailAddress}`,n.addEventListener("click",(()=>openFlexSite(`${n.innerHTML}`))),t.appendChild(n),m.appendChild(t)}}}))),n.style.display="none",t.style.display="none",e.style.visibility="hidden",e.style.display="flex";const p=m;p.style.resize="",p.style.overflow="",p.style.height="auto",p.getBoundingClientRect().height>120&&(p.style.resize="vertical",p.style.overflow="auto",p.style.height="120px"),e.style.visibility=""}))},getEmailString=e=>`${e.displayName}${-1===e.displayName.indexOf("@")?` (${e.emailAddress})`:""}`;function itemChanged(e){console.log("hit2"),updateReadUI()}