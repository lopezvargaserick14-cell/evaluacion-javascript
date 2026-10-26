const contenedorProductos = document.querySelector("#contenedor-productos");
const plantillaProducto = document.querySelector("#plantilla-producto");
let productosOriginales = [];

const inputBusqueda = document.querySelector("#input-busqueda");
const filtroCategoria = document.querySelector("#filtro-categoria");
const filtroOrden = document.querySelector("#filtro-orden");

function renderizarProductos(productos){
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
    const copia = plantillaProducto.content.cloneNode(true); 
        copia.querySelector(".img-producto").src = producto.image;
        copia.querySelector(".img-producto").alt = producto.title;
        copia.querySelector(".titulo-producto").textContent = producto.title;
        copia.querySelector(".producto-categoria").textContent = producto.category;
        copia.querySelector(".producto-precio").textContent = `$${producto.price}`;
        const btnAgregar = copia.querySelector(".boton-agregar");
        btnAgregar.addEventListener("click", () =>{
            agregarAlCarrito(producto);
        })
        contenedorProductos.appendChild(copia);
    });
}

function aplicarFiltros(){
    let resultado = [...productosOriginales];
    const texto = inputBusqueda.value.toLowerCase().trim();
    if (texto !== ""){
        resultado = resultado.filter(producto => 
        producto.title.toLowerCase().includes(texto) ||
        producto.description.toLowerCase().includes(texto)
        );
    }
    const categoria = filtroCategoria.value;
    if (categoria !== "todas") {
        resultado = resultado.filter(producto => producto.category === categoria);
    }

    const orden = filtroOrden.value;
    if (orden === "precio-menor") {
        resultado.sort((a, b) => a.price - b.price);
    } else if (orden === "precio-mayor") {
        resultado.sort((a, b) => b.price - a.price);
    } else if (orden === "nombre-az") {
        resultado.sort((a, b) => a.title.localeCompare(b.title));
    }

    renderizarProductos(resultado);
};
inputBusqueda.addEventListener("input", aplicarFiltros);
filtroCategoria.addEventListener("change", aplicarFiltros);
filtroOrden.addEventListener("change", aplicarFiltros);


async function iniciarTienda(){
    productosOriginales = await obtenerProductos();
    renderizarProductos(productosOriginales);
}
iniciarTienda();