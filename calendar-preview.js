/* Local Cal.com-style showcase. All availability is illustrative; nothing is sent. */
(() => {
 const root=document.querySelector('#calendar-preview'); if(!root) return;
 const tr=(en,th)=>`<span lang="en">${en}</span><span lang="th">${th}</span>`;
 const today=new Date(); today.setHours(0,0,0,0);
 let month=new Date(today.getFullYear(),today.getMonth(),1),duration=2,selected=null,time=null;
 const locale=()=>document.documentElement.lang==='th'?'th-TH':'en-GB';
 const fmt=(d,opts)=>d.toLocaleDateString(locale(),opts);
 const available=d=>d>today&&d.getDay()!==0&&d.getDay()!==6;
 selected=new Date(today); do{selected.setDate(selected.getDate()+1);}while(!available(selected));
 month=new Date(selected.getFullYear(),selected.getMonth(),1);
 root.innerHTML=`<div class="cal-topline"><span class="cal-label">${tr('Booking calendar preview','ตัวอย่างปฏิทินจองคิว')}</span><span class="cal-demo">${tr('Interactive demo','ตัวอย่างทดลองใช้')}</span></div>
 <div class="cal-disclaimer" role="note"><strong>${tr('Preview disclaimer','ข้อควรทราบเกี่ยวกับตัวอย่าง')}</strong><span>${tr("This is an illustrative mockup. The live Cal.com embed may look or behave differently; its theme, fields, and interactions depend on the client's Cal.com settings and may not automatically follow the website theme.",'นี่เป็นภาพจำลองเพื่อประกอบการนำเสนอ ปฏิทิน Cal.com จริงอาจมีรูปลักษณ์หรือการทำงานแตกต่างออกไป โดยธีม ช่องข้อมูล และการโต้ตอบขึ้นอยู่กับการตั้งค่า Cal.com ของลูกค้า และอาจไม่เปลี่ยนตามธีมของเว็บไซต์โดยอัตโนมัติ')}</span></div>
 <div class="cal-shell">
 <aside class="cal-panel cal-details"><img class="cal-avatar" src="image/about/01.webp" alt=""><div class="cal-owner"></div><h3>${tr('Booking request','ส่งคำขอจองคิว')}</h3><p class="cal-muted">${tr('Please select your preferred date, time, and duration.','กรุณาเลือกวัน เวลา และระยะเวลาที่ต้องการ')}</p>
 <div class="cal-facts"><div class="cal-fact"><b>◷</b><span>${tr('Duration','ระยะเวลา')}</span></div></div><div class="cal-duration" role="group" aria-label="Duration">${[2,4,8].map(n=>`<button type="button" data-duration="${n}" aria-pressed="${n===duration}">${n}${tr('h',' ชม.')}</button>`).join('')}</div>
 <div class="cal-facts"><div class="cal-fact"><b>⌖</b><span>${tr('Location agreed upon booking','ตกลงสถานที่เมื่อจองคิว')}</span></div><div class="cal-fact"><b>◎</b><span>Asia/Bangkok <span class="cal-muted">(UTC+7)</span></span></div><div class="cal-fact"><b>◇</b><span>${tr('Requires confirmation','ต้องได้รับการยืนยัน')}</span></div></div><p class="cal-muted">${tr('For projects longer than eight hours, please inquire directly.','สำหรับงานที่เกินแปดชั่วโมง กรุณาติดต่อโดยตรง')}</p></aside>
 <section class="cal-panel cal-calendar" aria-label="Choose a date"><div class="cal-monthbar"><h4 id="cal-month" aria-live="polite"></h4><div class="cal-monthnav"><button type="button" data-month="-1" aria-label="Previous month">‹</button><button type="button" data-month="1" aria-label="Next month">›</button></div></div><div class="cal-week"></div><div class="cal-days" aria-labelledby="cal-month"></div><div class="cal-legend">${tr('Sample availability · select a date','เวลาว่างตัวอย่าง · เลือกวันที่')}</div></section>
 <section class="cal-panel cal-times" aria-label="Choose a time"><h4 class="cal-time-title" aria-live="polite"></h4><div class="cal-slots"></div></section>
 <form class="cal-panel cal-form" hidden><h3>${tr('Enter details','รายละเอียดเพิ่มเติม')}</h3><p class="cal-summary"></p><p class="cal-muted">${tr('Preview only. Use sample details; nothing is sent or saved.','ตัวอย่างเท่านั้น ใช้ข้อมูลสมมติ ไม่มีการส่งหรือบันทึกข้อมูล')}</p><div class="cal-fields"><label>${tr('Name or brand','ชื่อหรือแบรนด์')}<input name="name" required maxlength="80" autocomplete="off" placeholder="Alex / Studio A"></label><label>${tr('Email','อีเมล')}<input name="email" type="email" required autocomplete="off" placeholder="alex@example.com"></label><label>${tr('Project type','ประเภทงาน')}<select name="project"><option>${trText('Editorial','เอดิทอเรียล')}</option><option>Campaign</option><option>Creative direction</option></select></label><label>${tr('Location','สถานที่')}<input name="location" placeholder="Bangkok" autocomplete="off"></label><label class="cal-wide">${tr('Tell me about your project','รายละเอียดโปรเจกต์')}<textarea name="notes" placeholder="A little about the concept, team, and timing…"></textarea></label></div><div class="cal-form-actions"><button type="button" data-back>${tr('← Back','← กลับ')}</button><button class="cal-primary" type="submit">${tr('Preview request →','ดูตัวอย่างคำขอ →')}</button></div></form>
 <section class="cal-success" hidden aria-live="polite"><div class="cal-success-mark">✓</div><h3 tabindex="-1">${tr('Request submitted','ส่งคำขอแล้ว')}</h3><p>${tr('Example confirmation — your request would await approval.','ตัวอย่างการยืนยัน — คำขอจะรอการอนุมัติ')}</p><p class="cal-summary"></p><p class="cal-muted">${tr('Demo complete. No booking was made and no details were sent.','จบการทดลอง ไม่มีการจองคิวหรือส่งข้อมูล')}</p><button type="button" data-reset>${tr('Explore another date','ลองเลือกวันอื่น')}</button></section></div>
 <div class="cal-branding">Cal.com</div><div class="cal-footnote"><span>${tr('Cal.com-style preview · illustrative availability','ตัวอย่างรูปแบบ Cal.com · เวลาว่างสมมติ')}</span><span>${tr('Illustration of the standard embed. Fields and availability depend on your account.','หน้าตาจริงขึ้นอยู่กับการตั้งค่า Cal.com ของคุณ')}</span></div>`;
 function trText(en,th){return document.documentElement.lang==='th'?th:en;}
 root.querySelector('.cal-owner').textContent=window.CLIENT_CONFIG?.name||'Client Name';
 function render(){
 root.querySelector('#cal-month').textContent=fmt(month,{month:'long',year:'numeric'});
 root.querySelector('[data-month="-1"]').disabled=month.getFullYear()===today.getFullYear()&&month.getMonth()===today.getMonth();
 root.querySelector('[data-month="1"]').disabled=month>=new Date(today.getFullYear(),today.getMonth()+11,1);
 root.querySelector('.cal-week').innerHTML=Array.from({length:7},(_,i)=>`<span>${fmt(new Date(2026,5,7+i),{weekday:'short'})}</span>`).join('');
 const days=root.querySelector('.cal-days');days.replaceChildren();
 for(let i=0;i<month.getDay();i++)days.append(document.createElement('span'));
 for(let n=1;n<=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();n++){
 const d=new Date(month.getFullYear(),month.getMonth(),n),b=document.createElement('button');b.type='button';b.textContent=n;b.disabled=!available(d);b.setAttribute('aria-label',fmt(d,{day:'numeric',month:'long',year:'numeric'}));b.setAttribute('aria-pressed',String(+d===+selected));b.onclick=()=>{selected=d;render();root.querySelector('.cal-days button[aria-pressed=true]')?.focus({preventScroll:true});};days.append(b);
 }
 root.querySelector('.cal-time-title').textContent=selected?fmt(selected,{weekday:'short',day:'numeric',month:'short'}):trText('Select a date','เลือกวันที่');
 const slots=root.querySelector('.cal-slots');slots.replaceChildren();
 if(selected)for(let hour=9;hour<=18-duration;hour++){
 const b=document.createElement('button');b.type='button';b.textContent=String(hour).padStart(2,'0')+':00';b.onclick=()=>{time=b.textContent;show('form');};slots.append(b);
 }
 }
 function show(step){
 root.querySelector('.cal-calendar').hidden=step!=='calendar';root.querySelector('.cal-times').hidden=step!=='calendar';root.querySelector('.cal-form').hidden=step!=='form';root.querySelector('.cal-success').hidden=step!=='success';
 root.querySelectorAll('.cal-summary').forEach(e=>e.textContent=selected&&time?`${fmt(selected,{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · ${time} · ${duration}h · Asia/Bangkok`:'');
 if(step==='form'){root.querySelector('input').focus({preventScroll:true});root.querySelector('.cal-form').scrollIntoView({block:'start',behavior:'auto'});}
 if(step==='success'){root.querySelector('.cal-success h3').focus();}
 }
 root.querySelectorAll('[data-month]').forEach(b=>b.onclick=()=>{month=new Date(month.getFullYear(),month.getMonth()+Number(b.dataset.month),1);selected=null;render();});
 root.querySelectorAll('[data-duration]').forEach(b=>b.onclick=()=>{duration=Number(b.dataset.duration);root.querySelectorAll('[data-duration]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));show('calendar');render();});
 root.querySelector('[data-back]').onclick=()=>{show('calendar');root.querySelector('.cal-days button[aria-pressed=true]')?.focus();};
 root.querySelector('form').onsubmit=e=>{e.preventDefault();show('success');root.querySelector('form').reset();};
 root.querySelector('[data-reset]').onclick=()=>{show('calendar');render();root.querySelector('.cal-days button[aria-pressed=true]')?.focus();};
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
