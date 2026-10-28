# 💻 TecnoStock - Catálogo y Gestión de Pedidos

Bienvenido a **TecnoStock**, una aplicación web ligera y modular para la consulta de productos tecnológicos y preparación de pedidos, desarrollada con **JavaScript nativo (Vanilla)**, Web Components y CSS responsivo, sin dependencias ni frameworks externos.

---

## 🚀 Cómo ejecutar el proyecto

> ⚠️ **Importante:** Este proyecto utiliza **Módulos de JavaScript (ES Modules)** y solicitudes `fetch()` a un archivo JSON local. Por políticas de seguridad del navegador (CORS), no debe abrirse con doble clic directo sobre el archivo; requiere ejecutarse mediante un servidor HTTP local.

### Opción 1: Con Visual Studio Code (Recomendada)
1. Abre la carpeta del proyecto en **VS Code**.
2. Haz clic derecho sobre el archivo `index.html`.
3. Selecciona **"Open with Live Server"** (o presiona `Alt + L, Alt + O`).
4. La aplicación se abrirá en tu navegador predeterminado (usualmente en `http://127.0.0.1:5500`).

### Opción 2: Con Python o Node.js desde la terminal
* **Con Python:** Ejecuta `python -m http.server 8000` y abre `http://localhost:8000`.
* **Con Node.js:** Ejecuta `npx serve .` y abre la URL indicada en consola.

---

## 📦 Funcionalidades Implementadas

### 1. Catálogo y Carga Asíncrona (RF-01)
* Carga los datos desde `products.json` mediante `fetch()` de manera local.
* **Validación de integridad:** Descarta automáticamente registros inválidos o con datos corruptos (precios negativos, IDs $\le 0$ o stock $< 0$).
* Muestra indicadores de estado mientras se carga el catálogo o en caso de fallo de red.

### 2. Búsqueda, Filtros y Ordenamiento (RF-02)
* Búsqueda en tiempo real por nombre o descripción (insensible a mayúsculas y espacios con `.trim()`).
* Menú desplegable de categorías poblado dinámicamente según los datos existentes.
* Checkbox **"Solo disponibles"** que aísla productos activos con stock mayor a cero.
* Ordenamiento por precio (menor a mayor y mayor a menor) y alfabético (A-Z con `localeCompare`).
* Botón **"Limpiar"** que restablece todos los controles y devuelve la vista al catálogo completo sin recargar la página.

### 3. Web Components y Eventos Personalizados (RF-05 y RF-06)
* `<product-card>`: Componente autónomo que presenta la información del artículo y despacha el evento personalizado `agregar-carrito` con propagación (`bubbles: true`, `composed: true`). Si el producto está inactivo o sin existencias, desactiva el botón y muestra "Agotado".
* `<product-list>`: Contenedor que instancia las tarjetas y presenta el mensaje *"No hay productos"* si los filtros no arrojan resultados.
* `<shopping-cart>`: Presenta las líneas del pedido, subtotales, y despacha eventos para modificar cantidades (`+` / `-`), eliminar ítems o vaciar el carrito.

### 4. Administración del Carrito y Reglas de Negocio (RF-03 y RF-04)
* Control de existencias: No permite añadir ni incrementar cantidades por encima del stock real disponible en tienda.
* El botón `-` disminuye la cantidad pero no permite valores menores a 1.
* **Descuento comercial del 10%:** Si el subtotal de compras alcanza o supera los **$300.000 COP**, el sistema calcula y aplica automáticamente un 10% de descuento.
* Todos los importes se muestran en pesos colombianos formateados con `.toLocaleString("es-CO")`.

### 5. Simulación de Confirmación de Pedido (RF-08)
* Al presionar **"Comprar"**, valida que el carrito no esté vacío y verifica nuevamente la disponibilidad de los artículos.
* Genera un identificador único para el pedido (ejemplo: `TECNO-M7X2K9`).
* Despliega un resumen con las líneas compradas, subtotal, descuento aplicado y total final.
* Vacía el carrito únicamente tras la confirmación exitosa de la compra.

### 6. Persistencia Segura con LocalStorage (RF-07)
* Guarda el estado del carrito tras cada modificación.
* Recupera el estado al recargar (`F5`) validando la estructura del JSON y filtrando posibles datos inconsistentes o negativos.

### 7. Diseño Adaptable y Accesible (RF-09)
* Estructurado mediante 3 Media Queries específicas en `css/styles.css`:
  * **Móvil (`< 768px`):** Interfaz vertical a 1 columna para navegación táctil fluida.
  * **Tablet (`768px - 1024px`):** Catálogo a 2 columnas con carrito adaptado al ancho.
  * **Desktop (`> 1024px`):** Distribución horizontal con catálogo flexible y carrito lateral fijo.

---

## 📁 Estructura del Código

```
tecnostock/
├── index.html            # Estructura semántica principal
├── products.json         # Fuente de datos local
├── readme.md             # Documentación e instrucciones
├── css/
│   └── styles.css        # Estilos y Media Queries responsivos
└── js/
    ├── api.js            # Petición fetch y validación de datos
    ├── product-card.js   # Componente <product-card>
    ├── product-list.js   # Componente <product-list>
    ├── carrito.js        # Componente <shopping-cart>
    └── app.js            # Lógica central, eventos, reglas y LocalStorage
```

---

## 👨‍💻 Autor

**Erick David López Vargas**  
*Ruta de Desarrollo de Software - Campuslands*
