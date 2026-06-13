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
.onclick=()=>mostrar("posiciones");

document.getElementById("btnEstadisticas")
.onclick=()=>mostrar("estadisticas");

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
