VusCut.add({
  id:'text',name:'Text',
  panel(p,c){
    const V=VusCut,el=V.el;
    const t=el('input',{type:'text',value:c.text,placeholder:'Caption…'});
    t.oninput=()=>{c.text=t.value;V.draw()};
    const col=el('input',{type:'color',value:c.textColor});
    col.oninput=()=>{c.textColor=col.value;V.draw()};
    p.append(
      el('label',{},'Text',t),
      V.slider('Size',16,200,1,()=>c.textSize,v=>c.textSize=v),
      V.slider('Vertical position %',5,95,1,()=>c.textY,v=>c.textY=v),
      el('label',{},'Color',col)
    );
  }
});
