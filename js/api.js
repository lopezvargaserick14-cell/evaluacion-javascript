export async function getProductos() {
  const res = await fetch("./products.json");
  if (!res.ok) throw new Error("Error HTTP al consultar el catálogo");
  
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Formato de catálogo inválido");
  const validos = data.filter(p => {
    const { id, price, stock, name } = p;
    return typeof id === "number" && id > 0 &&
      typeof price === "number" && price > 0 &&
      typeof stock === "number" && stock >= 0 &&
      typeof name === "string" && name.trim() !== "";
  });
  return validos;
}
