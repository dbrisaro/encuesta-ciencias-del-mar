const typeLabels = {
  agreement:"Acuerdo", frequency:"Frecuencia", access:"Acceso",
  choice:"Opción única", multi:"Selección múltiple", scale:"Escala propia",
  open:"Respuesta abierta", note:"Nota", placeholder:"Escala validada"
};

let data = null;

function esc(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML;}

function statusMsg(t){document.getElementById("status").textContent=t;}

function buildRail(){
  const rail=document.getElementById("rail");
  rail.innerHTML='<div class="cap">Secciones</div>';
  data.sections.forEach((sec,s)=>{
    const a=document.createElement("a");
    a.href="#sec"+s;a.textContent=sec.id;
    rail.appendChild(a);
  });
}

function pill(text){return '<span class="pill">'+esc(text)+'</span>';}

function renderScales(){
  const wrap=document.getElementById("scalesPanel");
  wrap.innerHTML="";
  Object.keys(data.scales).forEach(key=>{
    const block=document.createElement("div");
    block.className="scale-block";
    let h='<h3>'+esc(typeLabels[key]||key)+'</h3><div class="pills" style="margin-left:0">';
    data.scales[key].forEach(opt=>{h+=pill(opt);});
    h+='</div>';
    block.innerHTML=h;
    wrap.appendChild(block);
  });
}

function renderItem(item,qnum){
  if(item.type==="note"){
    if(item.team){
      return '<div class="item"><div class="note-team"><b>Nota para el equipo:</b> '+esc(item.text)+'</div></div>';
    }
    return '<div class="item"><div class="item-row"><div class="item-text note-line">'+esc(item.text)+'</div></div></div>';
  }
  if(item.type==="placeholder"){
    return '<div class="item"><div class="item-row"><div class="item-num">'+qnum+'</div><div class="note-team" style="flex:1"><b>Escala validada:</b> '+esc(item.text)+'</div></div></div>';
  }
  let body='<div class="item"><div class="item-row"><div class="item-num">'+qnum+'</div><div class="item-text">'+esc(item.text)+'</div><div class="item-type">'+esc(typeLabels[item.type]||item.type)+'</div></div>';
  if(item.type==="agreement"||item.type==="frequency"||item.type==="access"){
    body+='<div class="pill-label">escala: '+esc(typeLabels[item.type])+'</div><div class="pills">';
    data.scales[item.type].forEach(o=>{body+=pill(o);});
    body+='</div>';
    if(item.extra&&item.extra.length){
      body+='<div class="pill-label">opciones adicionales</div><div class="pills">';
      item.extra.forEach(o=>{body+=pill(o);});
      body+='</div>';
    }
  } else if(item.type==="choice"||item.type==="scale"||item.type==="multi"){
    body+='<div class="pill-label">opciones'+(item.type==="multi"?" (selección múltiple, máximo "+(item.max||3)+")":"")+'</div><div class="pills">';
    (item.options||[]).forEach(o=>{body+=pill(o);});
    body+='</div>';
  } else if(item.type==="open"){
    body+='<div class="open-prev">Respuesta abierta</div>';
  }
  body+='</div>';
  return body;
}

function render(){
  const root=document.getElementById("sections");
  root.innerHTML="";
  document.getElementById("docTitle").textContent=data.title;
  document.title=data.title;
  data.sections.forEach((sec,s)=>{
    const card=document.createElement("section");
    card.className="card";card.id="sec"+s;
    let h='<div class="sec-head"><span class="sec-tag">'+esc(sec.id)+'</span><h2 class="sec-title">'+esc(sec.title)+'</h2></div>';
    if(sec.kind==="text"){
      h+='<div class="text-body">'+esc(sec.content)+'</div>';
    } else {
      if(sec.note)h+='<div class="sec-note">'+esc(sec.note)+'</div>';
      let qnum=0;
      sec.items.forEach(item=>{
        const isQ=item.type!=="note";
        if(isQ)qnum++;
        h+=renderItem(item,isQ?qnum:"");
      });
    }
    card.innerHTML=h;
    root.appendChild(card);
  });
  buildRail();
}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  if(b.dataset.act==="md")downloadMarkdown();
});

function download(name,text,type){
  const blob=new Blob([text],{type:type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=name;a.click();
  URL.revokeObjectURL(url);
}

function downloadMarkdown(){
  if(!data){statusMsg("Todavía no se cargó la encuesta.");return;}
  let m="# "+data.title+"\n";
  data.sections.forEach(sec=>{
    m+="\n## "+sec.id+". "+sec.title+"\n";
    if(sec.kind==="text"){m+="\n"+sec.content+"\n";return;}
    if(sec.note)m+="\n"+sec.note+"\n";
    let qnum=0;
    sec.items.forEach(item=>{
      if(item.type==="note"){
        m+="\n"+(item.team?"[Nota: "+item.text+"]":item.text)+"\n";return;
      }
      qnum++;
      if(item.type==="placeholder"){m+="\n"+qnum+". [Escala validada] "+item.text+"\n";return;}
      m+="\n"+qnum+". "+item.text+"\n";
      if(item.type==="agreement"||item.type==="frequency"||item.type==="access"){
        m+="   "+typeLabels[item.type]+": "+data.scales[item.type].join(" / ")+"\n";
        if(item.extra&&item.extra.length)m+="   Opciones adicionales: "+item.extra.join(" / ")+"\n";
      }else if(item.type==="choice"||item.type==="scale"||item.type==="multi"){
        if(item.type==="multi")m+="   [selección múltiple, máximo "+(item.max||3)+"]\n";
        (item.options||[]).forEach(op=>{m+="   - "+op+"\n";});
      }else if(item.type==="open"){m+="   [respuesta abierta]\n";}
    });
  });
  download("encuesta.md",m,"text/markdown");
  statusMsg("Markdown descargado.");
}

fetch("survey.json")
  .then(r=>{if(!r.ok)throw new Error("status "+r.status);return r.json();})
  .then(d=>{data=d;renderScales();render();statusMsg("");})
  .catch(err=>{
    statusMsg("No se pudo cargar survey.json. Esta página necesita un servidor local, no la abras con doble clic. Desde la carpeta del proyecto ejecutá: python3 -m http.server 8000 y abrí http://localhost:8000");
  });
