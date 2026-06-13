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
        <td>${index+1}</td>
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
        <td>${index+1}</td>
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

  document.getElementById(
    "statPuntos"
  ).textContent =
    jugados * 2;

  const ranking =
  JSON.parse(
    localStorage.getItem(
      "rankingProde"
    )
  ) || [];

  if(ranking.length){

    const lider = [...ranking]
    .sort((a,b)=>b.puntos-a.puntos)[0];

    const dobles = [...ranking]
    .sort((a,b)=>b.dobles-a.dobles)[0];

    document.getElementById(
      "statLider"
    ).textContent =
      `${lider.nombre} (${lider.puntos})`;

    document.getElementById(
      "statDobles"
    ).textContent =
      `${dobles.nombre} (${dobles.dobles})`;

  }

}

recalcularProde();
actualizarEstadisticas();
