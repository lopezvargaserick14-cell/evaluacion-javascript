export async function getProductos() {
  const res = await fetch("./products.json");
  if (!res.ok) throw new Error();
  return await res.json();
}
