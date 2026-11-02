VusCut.add({
  id:'trim',name:'Trim',
  panel(p,c){
    const V=VusCut,el=V.el;
    const btn=(t,f)=>el('button',{textContent:t,onclick:f});
    p.append(
      V.num('In (s)',()=>c.in,v=>c.in=Math.max(0,Math.min(v,c.out-0.1))),
      V.num('Out (s)',()=>c.out,v=>c.out=Math.min(c.v.duration,Math.max(v,c.in+0.1))),
      V.num('Speed',()=>c.speed,v=>c.speed=Math.min(4,Math.max(0.25,v)),0.25),
      el('div',{className:'row'},
        btn('Split at playhead',()=>{
          const t=c.v.currentTime;
          if(t<=c.in+0.1||t>=c.out-0.1)return;
          const n={...c,f:{...c.f},in:t,name:c.name+' B'};
          c.out=t;V.clips.splice(V.sel+1,0,n);V.update();
        }),
        btn('Duplicate',()=>{V.clips.splice(V.sel+1,0,{...c,f:{...c.f}});V.sel++;V.update()}),
        btn('Delete',()=>{V.clips.splice(V.sel,1);V.sel=Math.min(V.sel,V.clips.length-1);V.update()}),
        btn('Move left',()=>{const i=V.sel;if(i>0){[V.clips[i-1],V.clips[i]]=[V.clips[i],V.clips[i-1]];V.sel--;V.update()}}),
        btn('Move right',()=>{const i=V.sel;if(i<V.clips.length-1){[V.clips[i+1],V.clips[i]]=[V.clips[i],V.clips[i+1]];V.sel++;V.update()}})
      ),
      el('p',{className:'hint',textContent:'Drag the preview slider, then Split to cut at that frame.'})
    );
  }
});
