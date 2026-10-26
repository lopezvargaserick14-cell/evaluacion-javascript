const url_api = '../products.json';
async function obtenerProductos() {
    try{
    const respuesta = await fetch(url_api);
    const productos = await respuesta.json();
    return productos;    
    }catch(error){
        console.error("Error al traer los datos: ", error);
        return [];
    }
}