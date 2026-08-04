let categorias = document.querySelectorAll("data-categoria");

categorias.addEventlistener(
    "submit", async (e) => {
    e.preventDefault();

    let gaming = document.querySelector("a[data-categoria='gaming']").dataset.categoria;
    let celulares = document.querySelector("a[data-categoria='celulares']").dataset.categoria;
    let electronica = document.querySelector("a[data-categoria='electronica']").dataset.categoria;
    let audio = document.querySelector("a[data-categoria='audio']").dataset.categoria;
    let moda = document.querySelector("a[data-categoria='moda']").dataset.categoria;
    let hogar = document.querySelector("a[data-categoria='hogar']").dataset.categoria;
}
)