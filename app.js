const typeLabels = {
  agreement:"Acuerdo", frequency:"Frecuencia", access:"Acceso",
  choice:"Opción múltiple", scale:"Escala propia", open:"Respuesta abierta",
  note:"Nota", placeholder:"Escala validada"
};
const questionTypes = ["agreement","frequency","access","choice","scale","open","placeholder","note"];

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

function pill(text,cls){return '<span class="pill '+(cls||"")+'">'+esc(text)+'</span>';}

function renderScales(){
  const wrap=document.getElementById("scalesPanel");
  wrap.innerHTML="";
  Object.keys(data.scales).forEach(key=>{
    const block=document.createElement("div");
    block.className="scale-block";
    let h='<h3>'+esc(typeLabels[key]||key)+'</h3><div class="pills" style="margin-left:0">';
    data.scales[key].forEach((opt,o)=>{
      h+='<span class="pill edit"><span contenteditable="true" data-kind="scaleopt" data-sc="'+key+'" data-o="'+o+'">'+esc(opt)+'</span><span class="x" data-act="delscaleopt" data-sc="'+key+'" data-o="'+o+'">&times;</span></span>';
    });
    h+='<span class="pill add" data-act="addscaleopt" data-sc="'+key+'">+ opción</span></div>';
    block.innerHTML=h;
    wrap.appendChild(block);
  });
}

function renderItem(sec,s,item,i,qnum){
  if(item.type==="note"){
    if(item.team){
      return '<div class="item"><div class="note-team"><b>Nota para el equipo:</b> <span contenteditable="true" data-kind="itemtext" data-s="'+s+'" data-i="'+i+'">'+esc(item.text)+'</span>'+itemTools(s,i)+'</div></div>';
    }
    return '<div class="item"><div class="item-row"><div class="item-text note-line" contenteditable="true" data-kind="itemtext" data-s="'+s+'" data-i="'+i+'">'+esc(item.text)+'</div><div class="item-tools">'+typeSelect(s,i,item.type)+moveDel(s,i)+'</div></div></div>';
  }
  if(item.type==="placeholder"){
    return '<div class="item"><div class="item-row"><div class="item-num">'+qnum+'</div><div class="note-team" style="flex:1"><b>Escala validada:</b> <span contenteditable="true" data-kind="itemtext" data-s="'+s+'" data-i="'+i+'">'+esc(item.text)+'</span></div><div class="item-tools">'+typeSelect(s,i,item.type)+moveDel(s,i)+'</div></div></div>';
  }
  let body='<div class="item"><div class="item-row"><div class="item-num">'+qnum+'</div><div class="item-text" contenteditable="true" data-kind="itemtext" data-s="'+s+'" data-i="'+i+'">'+esc(item.text)+'</div><div class="item-tools">'+typeSelect(s,i,item.type)+moveDel(s,i)+'</div></div>';
  if(item.type==="agreement"||item.type==="frequency"||item.type==="access"){
    body+='<div class="pill-label">escala: '+esc(typeLabels[item.type])+'</div><div class="pills">';
    data.scales[item.type].forEach(o=>{body+=pill(o);});
    body+='</div>';
    if(item.extra&&item.extra.length){
      body+='<div class="pill-label">opciones adicionales</div><div class="pills">';
      item.extra.forEach((o,oi)=>{body+='<span class="pill edit"><span contenteditable="true" data-kind="extra" data-s="'+s+'" data-i="'+i+'" data-o="'+oi+'">'+esc(o)+'</span><span class="x" data-act="delextra" data-s="'+s+'" data-i="'+i+'" data-o="'+oi+'">&times;</span></span>';});
      body+='<span class="pill add" data-act="addextra" data-s="'+s+'" data-i="'+i+'">+ opción</span></div>';
    } else {
      body+='<div class="pills"><span class="pill add" data-act="addextra" data-s="'+s+'" data-i="'+i+'">+ opción adicional</span></div>';
    }
  } else if(item.type==="choice"||item.type==="scale"){
    body+='<div class="pill-label">opciones</div><div class="pills">';
    (item.options||[]).forEach((o,oi)=>{body+='<span class="pill edit"><span contenteditable="true" data-kind="opt" data-s="'+s+'" data-i="'+i+'" data-o="'+oi+'">'+esc(o)+'</span><span class="x" data-act="delopt" data-s="'+s+'" data-i="'+i+'" data-o="'+oi+'">&times;</span></span>';});
    body+='<span class="pill add" data-act="addopt" data-s="'+s+'" data-i="'+i+'">+ opción</span></div>';
  } else if(item.type==="open"){
    body+='<div class="open-prev">Respuesta abierta</div>';
  }
  body+='</div>';
  return body;
}

function typeSelect(s,i,t){
  let o='<select class="type" data-act="type" data-s="'+s+'" data-i="'+i+'">';
  questionTypes.forEach(qt=>{o+='<option value="'+qt+'"'+(qt===t?' selected':'')+'>'+esc(typeLabels[qt])+'</option>';});
  o+='</select>';
  return o;
}
function moveDel(s,i){
  return '<button data-act="up" data-s="'+s+'" data-i="'+i+'" title="Subir">&uarr;</button>'+
         '<button data-act="down" data-s="'+s+'" data-i="'+i+'" title="Bajar">&darr;</button>'+
         '<button class="rm" data-act="del" data-s="'+s+'" data-i="'+i+'" title="Borrar">&times;</button>';
}
function itemTools(s,i){return '<span class="item-tools" style="margin-left:8px">'+moveDel(s,i)+'</span>';}

function render(){
  const root=document.getElementById("sections");
  root.innerHTML="";
  document.querySelector('[data-kind="docTitle"]').textContent=data.title;
  data.sections.forEach((sec,s)=>{
    const card=document.createElement("section");
    card.className="card";card.id="sec"+s;
    let h='<div class="sec-head"><span class="sec-tag" contenteditable="true" data-kind="secid" data-s="'+s+'">'+esc(sec.id)+'</span><h2 class="sec-title" contenteditable="true" data-kind="sectitle" data-s="'+s+'">'+esc(sec.title)+'</h2></div>';
    if(sec.kind==="text"){
      h+='<div class="text-body" contenteditable="true" data-kind="seccontent" data-s="'+s+'">'+esc(sec.content)+'</div>';
    } else {
      h+='<div class="sec-note" contenteditable="true" data-kind="secnote" data-s="'+s+'">'+esc(sec.note||"")+'</div>';
      let qnum=0;
      sec.items.forEach((item,i)=>{
        const isQ=item.type!=="note";
        if(isQ)qnum++;
        h+=renderItem(sec,s,item,i,isQ?qnum:"");
      });
      h+='<div class="additem"><button data-act="add" data-s="'+s+'">+ Agregar pregunta</button></div>';
    }
    card.innerHTML=h;
    root.appendChild(card);
  });
  buildRail();
}

document.addEventListener("input",e=>{
  if(!data)return;
  const el=e.target;const k=el.dataset.kind;if(!k)return;
  const s=+el.dataset.s, i=+el.dataset.i, o=+el.dataset.o;
  const t=el.textContent;
  if(k==="docTitle")data.title=t;
  else if(k==="secid")data.sections[s].id=t;
  else if(k==="sectitle")data.sections[s].title=t;
  else if(k==="secnote")data.sections[s].note=t;
  else if(k==="seccontent")data.sections[s].content=el.innerText;
  else if(k==="itemtext")data.sections[s].items[i].text=t;
  else if(k==="opt")data.sections[s].items[i].options[o]=t;
  else if(k==="extra")data.sections[s].items[i].extra[o]=t;
  else if(k==="scaleopt")data.scales[el.dataset.sc][o]=t;
  if(k==="secid")buildRail();
});

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");if(!b)return;
  const act=b.dataset.act;const s=+b.dataset.s, i=+b.dataset.i, o=+b.dataset.o, sc=b.dataset.sc;
  if(act==="md"){downloadMarkdown();return;}
  if(act==="json"){download("survey.json",JSON.stringify(data,null,2),"application/json");statusMsg("survey.json descargado. Reemplazá el archivo del repositorio con este para aplicar los cambios.");return;}
  if(act==="import"){document.getElementById("fileInput").click();return;}
  if(!data)return;
  if(act==="add"){data.sections[s].items.push({type:"agreement",text:"Nueva pregunta"});render();return;}
  if(act==="del"){data.sections[s].items.splice(i,1);render();return;}
  if(act==="up"&&i>0){const it=data.sections[s].items;[it[i-1],it[i]]=[it[i],it[i-1]];render();return;}
  if(act==="down"){const it=data.sections[s].items;if(i<it.length-1){[it[i+1],it[i]]=[it[i],it[i+1]];render();}return;}
  if(act==="addopt"){const it=data.sections[s].items[i];it.options=it.options||[];it.options.push("Nueva opción");render();return;}
  if(act==="delopt"){data.sections[s].items[i].options.splice(o,1);render();return;}
  if(act==="addextra"){const it=data.sections[s].items[i];it.extra=it.extra||[];it.extra.push("Nueva opción");render();return;}
  if(act==="delextra"){data.sections[s].items[i].extra.splice(o,1);render();return;}
  if(act==="addscaleopt"){data.scales[sc].push("Nueva opción");renderScales();render();return;}
  if(act==="delscaleopt"){data.scales[sc].splice(o,1);renderScales();render();return;}
});

document.addEventListener("change",e=>{
  if(!data)return;
  const b=e.target.closest('[data-act="type"]');if(!b)return;
  const s=+b.dataset.s,i=+b.dataset.i;const it=data.sections[s].items[i];
  it.type=b.value;
  if((it.type==="choice"||it.type==="scale")&&!it.options)it.options=["Opción 1","Opción 2"];
  render();
});

document.getElementById("fileInput").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=()=>{
    try{
      const obj=JSON.parse(r.result);
      data=obj;
      renderScales();render();statusMsg("Encuesta cargada desde el archivo.");
    }catch(err){statusMsg("No se pudo leer el archivo. Verificá que sea un JSON con el formato de survey.json.");}
  };
  r.readAsText(f);
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
      }else if(item.type==="choice"||item.type==="scale"){
        (item.options||[]).forEach(op=>{m+="   - "+op+"\n";});
      }else if(item.type==="open"){m+="   [respuesta abierta]\n";}
    });
  });
  download("encuesta.md",m,"text/markdown");
  statusMsg("Markdown descargado.");
}

fetch("survey.json")
  .then(r=>{if(!r.ok)throw new Error("status "+r.status);return r.json();})
  .then(d=>{data=d;renderScales();render();})
  .catch(err=>{
    statusMsg("No se pudo cargar survey.json. Esta herramienta necesita un servidor local, no la abras con doble clic. Desde la carpeta del proyecto ejecutá: python3 -m http.server 8000 y abrí http://localhost:8000");
  });
