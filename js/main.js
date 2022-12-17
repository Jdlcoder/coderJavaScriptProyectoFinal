//funcion encargada de traer los libros que estan en un archivo json mediante la libreria Axios
function resetArrBooks() {
    //usamos axios para obtener la información provista en el archivo books.json
    axios.get('../books.json')
        .then(response => {
            // accededemos a los datos del archivo JSON a través de la propiedad "response.data"
            main(response.data)
        })
        .catch(error => {
            // mostramos mensaje de error usando la librería sweetalert
            Swal.fire({
                title: 'Error!',
                text: `Ha habido un problema con la solicitud: ${error}`,
                icon: 'error',
                confirmButtonText: 'Continuar'
            })
        });
}

//funcion principal encargada de escribir el DOM
function main(books) {
    //me traigo del DOM los elementos que voy a modificar
    let container = document.getElementsByClassName("container")[0]
    let checkout = document.getElementById("checkout")
    let buttonShowBasket = document.getElementById('btnVerCarrito')
    let btnEmptyBasket = document.getElementById("emptyBasket")
    let btnHome = document.getElementById("btnHome")

    //Si la lista del localStorage esta vacia, la defino sin elementos
    let basket = JSON.parse(localStorage.getItem("basket")) || []

    //agrego funcionalidad de filtrado de los libros que se muestran según el título
    let inFinderByTitle = document.getElementById("inFinderByTitle")
    inFinderByTitle.addEventListener("input", filterByTitle)
    renderContainer(books)

    //agrego funcionalidad al boton Ver Carrito
    buttonShowBasket.addEventListener('click', () => {
        //limpio pantalla del catalogo y recargo el carrito
        container.innerHTML = ""
        renderCheckout()
    })

    //agrego funcionalidad para Vaciar carrito
    btnEmptyBasket.addEventListener("click", emptyBasket)

    //agrego funcionalidad al boton Ver Carrito
    btnHome.addEventListener('click', () => {
        //limpio pantalla del catalogo y recargo el carrito
        //reinicializo las pantallas
        checkout.innerHTML=""
        renderContainer(books)
        main(books)
    })

    //muestro los botones de Ver y Vaciar carrito solo si hay elementos
    renderBtnNavCheckout()

    //función encargada de actualizar los cambios en el DOM, sección listado libros
    function renderContainer(arrBooks) {
        container.innerHTML = ""
        if (arrBooks.length > 0) {
            arrBooks.forEach(el => {
                let cards = document.createElement("div")
                let buttonClass = "btnAddItemBasquet"
                let buttonText = "Agregar al carrito"
                let stockClass = ""
                cards.className = "card"

                //defino el estilo según existencia de stock
                if (!el.stock > 0) {
                    //si no hay stock, deshabilito el boton de agregar al carrito
                    buttonClass = "buttonDisabled"
                    buttonText = "Agregar al carrito"
                    buttonText = "Sin Stock"
                    stockClass = "stockEmpty"
                }

                cards.innerHTML = `
                <div class="card-item">
                    <h1 class="title">${el.title}</h1>
                    <h4>
                        <span>Disponibilidad:</span>
                        <span class="${stockClass}">${el.stock > 0 ? el.stock+" u" :"Agotado"}</span>
                    </h4>
                    <h4 class="price">Precio:$${el.price}</h4>
                    <img class="book-image" src =${el.cover}>
                    <div class ="card__btn">
                        <button class="${buttonClass}" id=${el.id}>${buttonText}</button>
                    </div>
                </div>`
                container.append(cards)

                if (el.stock > 0) {
                    //solo le agrego el evento si hay stock
                    let buttonAddItem = document.getElementById(el.id)
                    buttonAddItem.addEventListener("click", addItemBasket)
                }
            })

            //muestro los botones de Ver y Vaciar carrito solo si hay elementos
            renderBtnNavCheckout()
        } else {
            container.innerHTML = "<h1>No se encontraron coincidencias con su búsqueda</h1>"
        }
    }

    //función encargada de filtrar los libros por coincidencia de título
    function filterByTitle() {
        let booksFilteredByTitle = books.filter(book => book.title.includes(inFinderByTitle.value))
        renderContainer(booksFilteredByTitle)
    }

    //funcion encargada de agregar item al carrito
    function addItemBasket(e) {

        //agrego al carrito, pero antes veo si tiene pedidos del mismo item. en ese caso, incremento count
        let itemInBasket = basket.find((book) => book.id == e.target.id) || []
        let tmpcount
        let book = books.find((el) => el.id == e.target.id)

        //me fijo si ya tiene algún item de este id
        itemInBasket.length == 0 ? tmpcount = 1 : tmpcount = itemInBasket.count + 1

        //para que no me queden elementos duplicados en el array basket, busco el que está, lo borro y cargo el nuevo objeto
        let idxBasket = basket.findIndex(book => book.id == e.target.id)

        if (idxBasket != -1) {
            basket[idxBasket] = {
                id: basket[idxBasket].id,
                title: basket[idxBasket].title,
                author: basket[idxBasket].author,
                price: basket[idxBasket].price,
                count: basket[idxBasket].count + 1,
                subtotal: (basket[idxBasket].price * (basket[idxBasket].count + 1))
            }
        } else {
            basket.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                count: 1,
                subtotal: book.price
            })
        }
        updateStock(book.id)

        //vacio el LS y lo vuelvo a cargar con la data actualizada
        localStorage.removeItem("basket")
        localStorage.setItem("basket", JSON.stringify(basket))

        renderContainer(books)
        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
            title: 'Éxito!',
            text: `Se agregó al carrito : ${book.title}`,
            icon: 'success',
            confirmButtonText: 'Continuar'
        })
    }

    //funcion encargada de borrar de a un item del carrito
    function delItemBasket(e) {
        let id = e.target.id.split('_')[1]
        //agrego al carrito, pero antes veo si tiene pedidos del mismo item. en ese caso, incremento count
        let itemInBasket = basket.find((book) => book.id == id) || []
        let tmpcount
        let book = books.find((el) => el.id == id)

        //para que no me queden elementos duplicados en el array basket, busco el que está, lo borro y cargo el nuevo objeto
        let idxBasket = basket.findIndex(book => book.id == id)
        let basket_updated = basket.splice(idxBasket, 1)

        //vacio el LS y lo vuelvo a cargar con la data actualizada
        localStorage.removeItem("basket")
        localStorage.setItem("basket", JSON.stringify(basket_updated))

        //reinicializo las pantallas
        checkout.innerHTML=""
        renderContainer(books)

        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
            title: 'Éxito!',
            text: `Se eliminó del carrito : ${book.title}`,
            icon: 'success',
            confirmButtonText: 'Continuar'
        })
    }

    //funcion encargada de vaciar el carrito
    function emptyBasket() {
        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
                title: 'Estas por vaciar el carrito...',
                text: 'Estás seguro?',
                showCancelButton: true,
                icon: 'warning',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: "Cancelar",
            })
            .then(resultado => {
                if (resultado.value) {
                    basket = []
                    //vacio el LS y lo vuelvo a cargar con la data actualizada
                    localStorage.removeItem("basket")
                    renderCheckout()
                    renderContainer(books)
                    Swal.fire({
                        title: 'Éxito!',
                        text: 'Se vació el carrito correctamente',
                        icon: 'success',
                        confirmButtonText: 'Continuar'
                    })
                } else {
                    Swal.fire({
                        title: 'Sin cambios',
                        text: 'El carrito no se ha modificado',
                        icon: 'success',
                        confirmButtonText: 'Continuar'
                    })
                }
            })
    }

    //funcion encargada de actualizar el stock de libros
    function updateStock(bookId) {
        let idxBook = books.findIndex(book => book.id == bookId)
        if (idxBook != -1) {
            books[idxBook] = {
                id: books[idxBook].id,
                title: books[idxBook].title,
                author: books[idxBook].author,
                content_short: books[idxBook].content_short,
                publisher: books[idxBook].publisher,
                publisher_date: books[idxBook].publisher_date,
                pages: books[idxBook].pages,
                lenguage: books[idxBook].lenguage,
                cover: books[idxBook].cover,
                stock: books[idxBook].stock - 1,
                price: books[idxBook].price
            }
        }
    }

    //funcion para controlar la vista de los botones del carrito en el nav
    function renderBtnNavCheckout() {
        //si hay elementos en el carrito, le agrego el eventListener a los botones de Ver y Vaciar carrito
        if (basket.length > 0) {
            buttonShowBasket.className = "showBasket"
            btnEmptyBasket.className = "showBasket"
        } else {
            buttonShowBasket.className = "emptyBasket"
            btnEmptyBasket.className = "emptyBasket"
        }
    }

    //función encargada de renderizar el carrito
    function renderCheckout() {
        checkout.innerHTML = ""
        if (basket.length > 0) {
            //inicializo contador para calcular el importe total
            let total = 0

            checkout.innerHTML = `
            <h1>Detalle de tu pedido</h1>
            <div class="row headings">
                <div class="col basket_title">Producto</div>
                <div class="col basket_price">Precio Unitario</div>
                <div class="col basket_count">Cantidad</div>
                <div class="col basket_subtotal">Subtotal</div>
                <div class="col basket_action"></div>
            </div>`

            for (const item of basket) {
                let checkoutID = "checkout_" + item.id
                checkout.innerHTML += `
                <div class=row headings">
                    <div class="col basket_title">${item.title}</div>
                    <div class="col basket_price">${item.price}</div>
                    <div class="col basket_count">${item.count}</div>
                    <div class="col basket_subtotal">${item.subtotal}</div>
                    <button class="checkoutBtn" id=${checkoutID}>X</button>
                </div>`

                total += item.subtotal
            }

            //Muestro los botones Ver y Vaciar carrito sólo si no está vacío
            renderBtnNavCheckout()

            //agrego el importe total a pagar
            let totalHTML = document.createElement('div')
            totalHTML.innerHTML = `<h1 class="basket_total">Total $${total}</h1>`
            checkout.append(totalHTML)

            for (const item of basket) {
                let checkoutID = "checkout_" + item.id
                let buttonDelItem = document.getElementById(checkoutID)
                buttonDelItem.addEventListener("click", delItemBasket)
            }
        }
    }
}

//Hace el fetch para traerl los libros del JSON y llamar al main
resetArrBooks()