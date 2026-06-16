const screens = document.querySelectorAll(".screen");

function mostrar(id){
  screens.forEach(screen=>{
    screen.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");
}

document.getElementById("btnResultados")
.onclick=()=>{
  mostrar("resultados");
  renderPartidos();
};

document.getElementById("btnPosiciones")
.onclick=()=>{

  mostrarPosiciones();
  mostrarDobles();

  mostrar("posiciones");

};

document.getElementById("btnEstadisticas")
.onclick=()=>{

  
  actualizarEstadisticas();

  mostrar("estadisticas");

};

document.getElementById("btnPremios")
.onclick=()=>mostrar("premios");

document.getElementById("btnSobre")
.onclick=()=>mostrar("sobre");

document.getElementById("btnParticipantes")
.onclick=()=>{

  mostrarParticipantes();

  mostrar("participantes");

};

document.querySelectorAll(".volver")
.forEach(btn=>{
  btn.onclick=()=>mostrar("inicio");
});

function renderPartidos(){

  const contenedor =
  document.getElementById("listaPartidos");

  contenedor.innerHTML="";

  partidos.forEach(partido=>{

    contenedor.innerHTML += `
      <div class="partido">

  <span>${partido.local}</span>

  <input
    type="number"
    min="0"
    max="20"
    value="${partido.r1}"
  >

  <input
    type="number"
    min="0"
    max="20"
    value="${partido.r2}"
  >

  <span>${partido.visitante}</span>

  <div class="info-container">

  <button
    class="info-btn"
    onclick="verPronosticosPartido(${partido.id})"
  >
    ❗Pronósticos
  </button>

</div>

</div>
    `;

  });

}

function guardarResultados(){

  const inputs = document.querySelectorAll(".partido");

  inputs.forEach((partidoHTML,index)=>{

    const goles = partidoHTML.querySelectorAll("input");

    partidos[index].r1 = goles[0].value;
    partidos[index].r2 = goles[1].value;

  });

  localStorage.setItem(
    "prodeResultados",
    JSON.stringify(partidos)
  );

}

const guardados =
localStorage.getItem("prodeResultados");

if(guardados){

  const datos = JSON.parse(guardados);

  datos.forEach((partido,index)=>{

    if(partidos[index]){

      partidos[index].r1 = partido.r1;
      partidos[index].r2 = partido.r2;

    }

  });

}

document
.getElementById("btnGuardar")
.onclick=()=>{

  const confirmar = confirm(
    "¿Desea guardar los cambios realizados?"
  );

  if(!confirmar) return;

  guardarResultados();

recalcularProde();

actualizarEstadisticas();

  alert(
    "Resultados guardados correctamente."
  );

  mostrar("inicio");

};

function calcularPuntosPronostico(pron, real){

  const p1 = Number(pron.r1);
  const p2 = Number(pron.r2);

  const r1 = Number(real.r1);
  const r2 = Number(real.r2);

  if(
    p1 === r1 &&
    p2 === r2
  ){
    return {
      puntos:2,
      doble:1
    };
  }

  const signoPron =
    p1 > p2 ? "L" :
    p1 < p2 ? "V" : "E";

  const signoReal =
    r1 > r2 ? "L" :
    r1 < r2 ? "V" : "E";

  if(signoPron === signoReal){
    return {
      puntos:1,
      doble:0
    };
  }

  return {
    puntos:0,
    doble:0
  };

}

function recalcularProde(){

  const ranking = [];

  for(const participante in pronosticos){

    let puntos = 0;
    let dobles = 0;

    partidos.forEach(partido=>{

      if(
        partido.r1 === "" ||
        partido.r2 === ""
      ){
        return;
      }

      const pron =
      pronosticos[participante][partido.id];

      if(!pron) return;

      const resultado =
      calcularPuntosPronostico(
        pron,
        partido
      );

      puntos += resultado.puntos;
      dobles += resultado.doble;

    });

    ranking.push({
      nombre:participante,
      puntos,
      dobles
    });

  }

  ranking.sort(
    (a,b)=>b.puntos-a.puntos
  );

  localStorage.setItem(
    "rankingProde",
    JSON.stringify(ranking)
  );
}

function mostrarPosiciones(){

  const ranking =
  JSON.parse(
    localStorage.getItem(
      "rankingProde"
    )
  ) || [];

  const tabla =
  document.getElementById(
    "tablaPosiciones"
  );

  tabla.innerHTML = "";

  ranking.forEach((fila,index)=>{

    tabla.innerHTML += `
      <tr>
        <td>
${
index===0 ? "🥇" :
index===1 ? "🥈" :
index===2 ? "🥉" :
index+1
}
</td>
        <td>${fila.nombre}</td>
        <td>${fila.puntos}</td>
      </tr>
    `;

  });

}

function mostrarDobles(){

  const ranking =
  JSON.parse(
    localStorage.getItem(
      "rankingProde"
    )
  ) || [];

  ranking.sort(
    (a,b)=>b.dobles-a.dobles
  );

  const tabla =
  document.getElementById(
    "tablaDobles"
  );

  tabla.innerHTML = "";

  ranking.forEach((fila,index)=>{

    tabla.innerHTML += `
      <tr>
        <td>
        ${
        index===0 ? "🥇" :
        index===1 ? "🥈" :
        index===2 ? "🥉" :
        index+1
        }
        </td>
        <td>${fila.nombre}</td>
        <td>${fila.dobles}</td>
      </tr>
    `;

  });

}

function actualizarEstadisticas(){

  const jugados = partidos.filter(
    p => p.r1 !== "" && p.r2 !== ""
  ).length;

  document.getElementById(
    "statPartidos"
  ).textContent =
    `${jugados} / 72`;

  const puntosRepartidos = jugados * 2;
const puntosFaltantes = 144 - puntosRepartidos;

document.getElementById(
  "statPuntos"
).textContent =
  `${puntosRepartidos} / ${puntosFaltantes}`;

  const ranking =
  JSON.parse(
    localStorage.getItem(
      "rankingProde"
    )
  ) || [];

  if(ranking.length){

    const topPuntos = [...ranking]
.sort((a,b)=>b.puntos-a.puntos)
.slice(0,3);

const topDobles = [...ranking]
.sort((a,b)=>b.dobles-a.dobles)
.slice(0,3);

document.getElementById(
  "statLider"
).innerHTML = topPuntos
.map((p,i)=>
`${["🥇","🥈","🥉"][i]} ${p.nombre} (${p.puntos})`
)
.join("<br>");

document.getElementById(
  "statDobles"
).innerHTML = topDobles
.map((p,i)=>
`${["🥇","🥈","🥉"][i]} ${p.nombre} (${p.dobles})`
)
.join("<br>");

  }

}



function mostrarParticipantes(){

  const contenedor =
  document.getElementById(
    "listaParticipantes"
  );

  contenedor.innerHTML = "";

  Object.keys(pronosticos)
  .forEach(nombre=>{

    contenedor.innerHTML += `
      <button
        class="card-btn participante-btn"
        onclick="mostrarDetalleParticipante('${nombre}')"
      >
        👤 ${nombre}
      </button>
    `;

  });

}

function mostrarDetalleParticipante(nombre){

  document.getElementById(
    "nombreParticipante"
  ).textContent = nombre;

  const ranking =
  JSON.parse(
    localStorage.getItem(
      "rankingProde"
    )
  ) || [];

  const participante =
  ranking.find(
    p => p.nombre === nombre
  );

  if(participante){

    document.getElementById(
      "detallePosicion"
    ).textContent =
      ranking.findIndex(
        p => p.nombre === nombre
      ) + 1;

    document.getElementById(
      "detallePuntos"
    ).textContent =
      participante.puntos;

    document.getElementById(
      "detalleDobles"
    ).textContent =
      participante.dobles;


    let aciertos = 0;

partidos.forEach(partido=>{

  if(
    partido.r1 === "" ||
    partido.r2 === ""
  ){
    return;
  }

  const pron =
  pronosticos[nombre][partido.id];

  if(!pron) return;

  const resultado =
  calcularPuntosPronostico(
    pron,
    partido
  );

  if(resultado.puntos > 0){
    aciertos++;
  }

});

const jugados =
partidos.filter(
  p => p.r1 !== "" && p.r2 !== ""
).length;

const efectividad =
jugados > 0
? (
(participante.puntos / (jugados * 2))
* 100
).toFixed(1)
: 0;

document.getElementById(
  "detalleAciertos"
).textContent =
  `${aciertos}/${jugados}`;

document.getElementById(
  "detalleEfectividad"
).textContent =
  `${efectividad}%`;

  }

  const lista =
  document.getElementById(
    "listaPronosticos"
  );

  lista.innerHTML = "";

  partidos.forEach(partido=>{

    const pron =
    pronosticos[nombre][partido.id];

    if(!pron) return;

    lista.innerHTML += `
      <div class="partido">

        <span>${partido.local}</span>

        <span class="resultado-fijo">
          ${pron.r1}
        </span>

        <span class="resultado-fijo">
          ${pron.r2}
        </span>

        <span>${partido.visitante}</span>

      </div>
    `;

  });

  mostrar("detalleParticipante");

}

document
.querySelectorAll(".volverParticipante")
.forEach(btn=>{

  btn.onclick=()=>{

    mostrar("participantes");

  };

});

function verPronosticosPartido(id){

  const partido =
  partidos.find(
    p => p.id === id
  );

  document.getElementById(
    "tituloPartido"
  ).textContent =
    `${partido.local} vs ${partido.visitante}`;

  let local = 0;
  let empate = 0;
  let visitante = 0;

  const lista =
  document.getElementById(
    "listaPronosticosPartido"
  );

  lista.innerHTML = "";

  Object.keys(pronosticos)
  .forEach(nombre=>{

    const pron =
    pronosticos[nombre][id];

    if(!pron) return;

    const r1 = Number(pron.r1);
    const r2 = Number(pron.r2);

    if(r1 > r2){
      local++;
    }
    else if(r1 < r2){
      visitante++;
    }
    else{
      empate++;
    }

    lista.innerHTML += `
  <div class="pronostico-item">
    <div>${nombre}</div>
    <br>
    <strong>
      ${pron.r1} - ${pron.r2}
    </strong>
  </div>
`;

  });

  document.getElementById(
    "statLocal"
  ).textContent = local;

  document.getElementById(
    "statEmpate"
  ).textContent = empate;

  document.getElementById(
    "statVisitante"
  ).textContent = visitante;

  mostrar("detallePartido");

}

document
.querySelectorAll(
  ".volverDetallePartido"
)
.forEach(btn=>{

  btn.onclick=()=>{

    mostrar("resultados");

  };

});

recalcularProde();
actualizarEstadisticas();
