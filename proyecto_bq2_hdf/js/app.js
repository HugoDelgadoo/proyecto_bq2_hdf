// menu hamburguesa
const btnMenu = document.getElementById("hamburguesa");
const menu = document.getElementById("menu");

btnMenu.addEventListener("click", () => {
    menu.classList.toggle("mostrar");
});

// variables
const btnBuscar = document.getElementById("btnBuscar");
const inputBusqueda = document.getElementById("inputBusqueda");
const resultados = document.getElementById("resultados");
const alertas = document.getElementById("alertas");
const btnRandom = document.getElementById("btnRandom");
const btnModo = document.getElementById("btnModo");
const linkFavoritos = document.getElementById("linkFavoritos");
const linkInicio = document.getElementById("linkInicio");

// variable que guarda los favoritos
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// guardar en localStorage
function guardarFavorito(bebida) {
    if (!favoritos.some(f => f.idDrink === bebida.idDrink)) {
        favoritos.push(bebida);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        mostrarAlerta("Añadido a favoritos");
    }
}

function mostrarFavoritos() {
    if (favoritos.length === 0) {
        mostrarAlerta("No tienes favoritos guardados");
        resultados.innerHTML = "";
        return;
    }
    mostrarResultados(favoritos, true);
}

// favoritos del usuario
linkFavoritos.addEventListener("click", () => {
    mostrarFavoritos();
});

linkInicio.addEventListener("click", () => {
    resultados.innerHTML = "";
});

// buscador de cocteles
btnBuscar.addEventListener("click", buscarCocktail);

function buscarCocktail() {
    const termino = inputBusqueda.value.trim();
    if (termino === "") {
        mostrarAlerta("Introduce un nombre para buscar");
        return;
    }

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${termino}`)
        .then(res => res.json())
        .then(data => {
            if (!data.drinks) {
                mostrarAlerta("No se encontraron resultados");
                resultados.innerHTML = "";
                return;
            }
            mostrarResultados(data.drinks);
        })
        .catch(() => mostrarAlerta("Error de conexión con la API"));
}

//genera coctel aleatorioo
btnRandom.addEventListener("click", () => {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
        .then(res => res.json())
        .then(data => mostrarResultados(data.drinks))
        .catch(() => mostrarAlerta("No se pudo cargar un cóctel aleatorio"));
});

// alertas
function mostrarAlerta(mensaje) {
    alertas.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
            ${mensaje}
        </div>
    `;
}

// tarjetas de resultados
function mostrarResultados(lista, esFavoritos = false) {
    resultados.innerHTML = "";

    lista.forEach(bebida => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
        <div class="card">
            <img src="${bebida.strDrinkThumb}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${bebida.strDrink}</h5>
                <p class="card-text">${bebida.strCategory}</p>

                <button class="btn btn-primary mb-2" onclick='verMas(${JSON.stringify(bebida).replace(/'/g, "")})'>
                    Ver más
                </button>

                ${
                    !esFavoritos
                        ? `<button class="btn btn-warning" onclick='guardarFavorito(${JSON.stringify(bebida).replace(/'/g, "")})'>
                                Añadir a favoritos
                           </button>`
                        : ""
                }
            </div>
        </div>
        `;

        resultados.appendChild(col);
    });
}

// modal
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrarModal");
const modalInfo = document.getElementById("modalInfo");

cerrarModal.addEventListener("click", () => modal.style.display = "none");

function verMas(bebida) {
    let ingredientes = "";

    for (let i = 1; i <= 15; i++) {
        const ing = bebida[`strIngredient${i}`];
        const med = bebida[`strMeasure${i}`];
        if (ing) ingredientes += `<li>${ing} - ${med || ""}</li>`;
    }

    modalInfo.innerHTML = `
        <h2>${bebida.strDrink}</h2>
        <img src="${bebida.strDrinkThumb}" class="img-fluid mb-3">
        <p><strong>Categoría:</strong> ${bebida.strCategory}</p>
        <p><strong>Tipo:</strong> ${bebida.strAlcoholic}</p>
        <h4>Ingredientes</h4>
        <ul>${ingredientes}</ul>
        <h4>Instrucciones</h4>
        <p>${bebida.strInstructionsES || bebida.strInstructions}</p>
    `;

    modal.style.display = "flex";
}

// modo oscuro y claro
btnModo.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");

    if (document.body.classList.contains("oscuro")) {
        btnModo.textContent = "Modo claro";
        localStorage.setItem("modo", "oscuro");
        
    } else {
        btnModo.textContent = "Modo oscuro";
        localStorage.setItem("modo", "claro");
    }
});

// Cargar modo guardado
if (localStorage.getItem("modo") === "oscuro") {
    document.body.classList.add("oscuro");
    btnModo.textContent = "Modo claro";
}
