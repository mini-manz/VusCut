VusCut.add({
  id:'filters',name:'Look',
  panel(p,c){
    const V=VusCut,el=V.el,f=c.f;
    const S=(l,min,max,step,k)=>V.slider(l,min,max,step,()=>f[k],v=>f[k]=v);
    p.append(
      S('Brightness %',0,200,1,'brightness'),
      S('Contrast %',0,200,1,'contrast'),
      S('Saturation %',0,300,1,'saturate'),
      S('Blur px',0,20,0.5,'blur'),
      S('Grayscale %',0,100,1,'gray'),
      el('div',{className:'row'},
        el('button',{textContent:'Rotate 90°',onclick:()=>{c.rot=(c.rot+90)%360;V.draw()}}),
        el('button',{textContent:'Reset',onclick:()=>{Object.assign(f,{brightness:100,contrast:100,saturate:100,blur:0,gray:0});c.rot=0;V.update()}})
      )
    );
  }
});
