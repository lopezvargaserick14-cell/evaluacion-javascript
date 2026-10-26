export async function getProductos() {
  const res = await fetch("./products.json");
  if (!res.ok) {
    throw new Error("No se pudo obtener el catálogo");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Datos no válidos");
  }
  return data;
}
