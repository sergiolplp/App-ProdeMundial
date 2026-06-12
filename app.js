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
