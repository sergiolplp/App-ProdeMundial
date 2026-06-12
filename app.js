const screens = document.querySelectorAll(".screen");

function mostrar(id){

  screens.forEach(screen=>{
    screen.classList.remove("active");
  });

  document
  .getElementById(id)
  .classList.add("active");
}

document
.getElementById("btnResultados")
.onclick=()=>mostrar("resultados");

document
.getElementById("btnPosiciones")
.onclick=()=>mostrar("posiciones");

document
.getElementById("btnEstadisticas")
.onclick=()=>mostrar("estadisticas");

document
.querySelectorAll(".volver")
.forEach(btn=>{

  btn.onclick=()=>mostrar("inicio");

});
