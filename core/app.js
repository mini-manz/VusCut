(()=>{
const W=1280,H=720;
const V=window.VusCut={tools:[],clips:[],sel:-1,active:null,playing:false};
const el=(t,a={},...c)=>{const e=document.createElement(t);Object.assign(e,a);e.append(...c);return e};
V.el=el;
V.add=t=>{V.tools.push(t);if(V.ui)V.ui.tabs()};
V.clip=()=>V.clips[V.sel];

// helper for tools: labelled slider
V.slider=(label,min,max,step,get,set)=>{
  const out=el('span',{textContent:get()});
  const i=el('input',{type:'range',min,max,step,value:get()});
  i.oninput=()=>{set(+i.value);out.textContent=i.value;V.draw()};
  return el('label',{},el('span',{},label+': ',out),i);
};
V.num=(label,get,set,step=0.1)=>{
  const i=el('input',{type:'number',step,value:+get().toFixed(2)});
  i.onchange=()=>{set(+i.value);V.update()};
  return el('label',{},label,i);
};

const cv=el('canvas',{id:'cv',width:W,height:H});
const ctx=cv.getContext('2d');
const scrub=el('input',{id:'scrub',type:'range',min:0,max:1,step:0.01,value:0});
const panel=el('div',{id:'panel'});
const tabs=el('div',{id:'tabs'});
const tl=el('div',{id:'tl'});
let tool=null,ac=null,dest=null;

V.draw=()=>{
  ctx.filter='none';ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const c=V.active||V.clip();if(!c)return;
  const v=c.v,rot=c.rot%180!==0;
  const vw=rot?v.videoHeight:v.videoWidth,vh=rot?v.videoWidth:v.videoHeight;
  if(!vw)return;
  const s=Math.min(W/vw,H/vh),f=c.f;
  ctx.save();
  ctx.filter=`brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) blur(${f.blur}px) grayscale(${f.gray}%)`;
  ctx.translate(W/2,H/2);ctx.rotate(c.rot*Math.PI/180);
  const dw=(rot?vh:vw)*s,dh=(rot?vw:vh)*s;
  ctx.drawImage(v,-dw/2,-dh/2,dw,dh);
  ctx.restore();
  ctx.filter='none';
  if(c.text){
    ctx.font=`bold ${c.textSize}px system-ui,sans-serif`;ctx.textAlign='center';
    ctx.lineWidth=c.textSize/8;ctx.strokeStyle='#000';ctx.fillStyle=c.textColor;
    const y=H*c.textY/100;
    ctx.strokeText(c.text,W/2,y);ctx.fillText(c.text,W/2,y);
  }
};

const seeked=(v,t)=>new Promise(r=>{
  if(Math.abs(v.currentTime-t)<0.01)return r();
  v.onseeked=()=>{v.onseeked=null;r()};v.currentTime=t;
});

V.update=async()=>{
  const c=V.clip();
  if(c){await seeked(c.v,Math.min(Math.max(c.v.currentTime,c.in),c.out));
    scrub.min=c.in;scrub.max=c.out;scrub.value=c.v.currentTime}
  V.draw();V.ui.timeline();V.ui.panel();
};

V.ui={
  tabs(){
    tabs.replaceChildren(...V.tools.map(t=>{
      const b=el('button',{textContent:t.name,className:t===tool?'on':''});
      b.onclick=()=>{tool=t;V.ui.tabs();V.ui.panel()};return b}));
  },
  panel(){
    if(!tool)tool=V.tools[0];
    panel.replaceChildren();
    const c=V.clip();
    if(!c||!tool)return void panel.append(el('p',{className:'hint',textContent:'Import a video and select a clip.'}));
    tool.panel(panel,c);
  },
  timeline(){
    tl.replaceChildren(...V.clips.map((c,i)=>{
      const w=Math.max(60,(c.out-c.in)/c.speed*20);
      const d=el('div',{className:'clip'+(i===V.sel?' on':''),textContent:`${c.name} (${((c.out-c.in)/c.speed).toFixed(1)}s)`});
      d.style.width=w+'px';
      d.onclick=()=>{V.sel=i;V.update()};return d}));
  }
};

async function importFiles(files){
  if(!ac){ac=new AudioContext();dest=ac.createMediaStreamDestination()}
  for(const f of files){
    if(!f.type.startsWith('video/'))continue;
    const v=el('video',{src:URL.createObjectURL(f),preload:'auto',playsInline:true});
    await new Promise((ok,no)=>{v.onloadedmetadata=ok;v.onerror=no}).catch(()=>0);
    if(!v.duration)continue;
    const src=ac.createMediaElementSource(v);src.connect(ac.destination);v._src=src;
    V.clips.push({name:f.name.replace(/\.[^.]+$/,''),v,in:0,out:v.duration,speed:1,
      f:{brightness:100,contrast:100,saturate:100,blur:0,gray:0},rot:0,
      text:'',textSize:56,textColor:'#ffffff',textY:88});
    V.sel=V.clips.length-1;
  }
  V.update();
}

V.playAll=async(from=0)=>{
  V.playing=true;
  for(let i=from;i<V.clips.length&&V.playing;i++){
    const c=V.clips[i];V.active=c;V.sel=i;V.ui.timeline();
    await seeked(c.v,c.in);c.v.playbackRate=c.speed;c.v.volume=1;
    await c.v.play();
    await new Promise(done=>{
      const tick=()=>{
        if(!V.playing||c.v.currentTime>=c.out||c.v.ended){c.v.pause();return done()}
        scrub.value=c.v.currentTime;V.draw();requestAnimationFrame(tick)};
      tick();
    });
  }
  V.active=null;V.playing=false;V.update();
};

V.exportWebm=async()=>{
  if(!V.clips.length)return;
  const types=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  const mimeType=types.find(t=>MediaRecorder.isTypeSupported(t));
  await ac.resume();
  V.clips.forEach(c=>c.v._src.connect(dest));
  const stream=new MediaStream([...cv.captureStream(30).getVideoTracks(),...dest.stream.getAudioTracks()]);
  const rec=new MediaRecorder(stream,{mimeType,videoBitsPerSecond:8e6}),chunks=[];
  rec.ondataavailable=e=>chunks.push(e.data);
  const stopped=new Promise(r=>rec.onstop=r);
  rec.start();await V.playAll(0);rec.stop();await stopped;
  V.clips.forEach(c=>c.v._src.disconnect(dest));
  const a=el('a',{href:URL.createObjectURL(new Blob(chunks,{type:'video/webm'})),download:'vuscut.webm'});
  a.click();
};

function build(){
  document.body.innerHTML='';
  const picker=el('input',{type:'file',accept:'video/*',multiple:true,hidden:true});
  picker.onchange=()=>importFiles([...picker.files]);
  const btn=(t,f,c='')=>el('button',{textContent:t,className:c,onclick:f});
  const header=el('header',{},el('b',{textContent:'VusCut'}),
    btn('Import',()=>picker.click()),
    btn('Play',()=>V.playing?(V.playing=false):V.playAll(Math.max(V.sel,0))),
    btn('Export WebM',V.exportWebm,'pri'),picker);
  const main=el('div',{id:'main'},cv,scrub);
  const side=el('div',{id:'side'},tabs,panel);
  const drop=el('div',{id:'drop',textContent:'Drop videos to import'});
  document.body.append(header,main,side,tl,drop);
  scrub.oninput=async()=>{const c=V.clip();if(c){c.v.currentTime=+scrub.value;c.v.onseeked=()=>V.draw()}};
  addEventListener('dragover',e=>{e.preventDefault();drop.style.display='flex'});
  addEventListener('dragleave',e=>{if(!e.relatedTarget)drop.style.display='none'});
  addEventListener('drop',e=>{e.preventDefault();drop.style.display='none';importFiles([...e.dataTransfer.files])});
  V.ui.tabs();V.ui.panel();V.ui.timeline();V.draw();
}
V.ui.ready=true;
build();
})();
