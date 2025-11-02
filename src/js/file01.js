"use strict";

import { fetchProducts, fetchCategories } from "./functions";

/**
 * Muestra el toast interactivo si existe en el DOM.
 *
 * @description Añade la clase `md:block` al elemento con id "toast-interactive" para mostrarlo.
 * @returns {void}
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
    }
};

/**
 * Registra el manejador de click para abrir un vídeo demostrativo en una nueva pestaña.
 *
 * @description Agrega un listener al elemento con id "demo" que abre un enlace de YouTube en una nueva ventana.
 * @returns {void}
 */
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * Obtiene productos remotos y renderiza los primeros 6 en el contenedor `#products-container`.
 *
 * @description Usa `fetchProducts` para recuperar los datos. Reemplaza marcadores en una plantilla HTML y lo inserta en el DOM.
 * @returns {Promise<void>} Promise que se resuelve cuando termina el renderizado o muestra una alerta si ocurre un error.
 */
let renderProducts = () => {
    fetchProducts('https://data-dawm.github.io/datum/reseller/products.json')
        .then(result => {
            if (result.success) {
                let container = document.getElementById("products-container");
                container.innerHTML = "";

                let products = result.body.slice(0, 6);

                products.forEach(product => {

                    let productHTML = `
                        <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                            <img
                                class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                                src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                            <h3
                                class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                                $[PRODUCT.PRICE]
                            </h3>

                            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                                <div class="space-y-2">
                                    <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                        Ver en Amazon
                                    </a>
                                    <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                                </div>
                            </div>
                        </div>`;
                    productHTML = productHTML.replaceAll("[PRODUCT.TITLE]", product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title);
                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRICE]", product.price);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRODUCTURL]", product.productURL);
                    productHTML = productHTML.replaceAll('[PRODUCT.CATEGORY_ID]', product.category_id);

                    container.innerHTML += productHTML;
                    
                });
            } else {
                alert(result.body);
            }
        });
};

/**
 * Recupera y renderiza las categorías desde un XML remoto en el elemento `#categories`.
 *
 * @description Llama a `fetchCategories` para obtener XML, construye opciones `<option>` y las añade al select.
 * @returns {Promise<void>} Promise que se resuelve cuando las categorías han sido renderizadas; muestra alert en caso de error.
 */
let renderCategories = async () => {
    try {
        let result = await fetchCategories('https://data-dawm.github.io/datum/reseller/categories.xml')
        .then(result => {
            if (result.success) {
                let container = document.getElementById("categories");
                container.innnerHTML = `<option selected disabled>Seleccione una categoría</option>`;

                let categoriesXML = result.body;

                let categories = categoriesXML.getElementsByTagName("category");

                for (let category of categories) {
                    let categoryHTML = `<option value="[ID]">[NAME]</option>`;

                    let id = category.getElementsByTagName("id")[0].textContent;
                    let name = category.getElementsByTagName("name")[0].textContent;


                    categoryHTML = categoryHTML.replace("[ID]", id);
                    categoryHTML = categoryHTML.replace("[NAME]", name);

                    container.innerHTML += categoryHTML;
                    
                }
            } else {
                throw new Error(result.body);
            }
        });
    } catch (error) {
        alert(result.body);
    }
}

(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
})();

