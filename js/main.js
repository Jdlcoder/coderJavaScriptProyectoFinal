function resetArrBooks() {
    console.log("hoo")
    // Ejemplo funcional de fetch
    // fetch("../books.json")
    // .then(response => response.json())
    // .then(data => {
    //   //accedo a los datos del json
    //   console.log(data.length)
    //   main(data)
    // })
    // .catch(error => {
    //   // En caso de error, se ejecutará este código
    //   console.error('Ha habido un problema con la solicitud:', error);
    // });


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

function main(books) {
    //como voy actualizando el stock a medida que se agregan items al carrito, guardo en LS para mantenerlo por si cierran el browser

    //me traigo del DOM los elementos que voy a modificar
    let container = document.getElementsByClassName("container")[0]
    let checkout = document.getElementById("checkout")

    //Si la lista del localStorage esta vacia, la defino sin elementos
    let basket = JSON.parse(localStorage.getItem("basket")) || []
    //inicializo el array books
    // resetArrBooks2()

    //si el carrito tiene elementos, le piso la clase default que lo oculta
    if (basket.length > 0) {
        checkout.className = "checkoutFilled"
        renderCheckout()
    }

    //agrego funcionalidad de filtrado de los libros que se muestran según el título
    let inFinderByTitle = document.getElementById("inFinderByTitle")
    inFinderByTitle.addEventListener("input", filterByTitle)
    renderContainer(books)

    //agrego funcionaidad para vaciar carrito
    let btnEmptyBasket = document.getElementById("emptyBasket")
    btnEmptyBasket.addEventListener("click", () => {
        //dejo en 0 la lista del carrito
        basket = []
        //vacío la key que tengo en el LS para los items del carrito
        localStorage.removeItem("basket")
        //vacío la key de books que tengo en LS, ya que se libera el stock
        // localStorage.removeItem("books")
        //renderizo para que el DOM esté actualizado
        btnEmptyBasket.className = "emptyBasket"
        renderCheckout()

        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
            title: 'Éxito!',
            text: 'Carrito vaciado exitosamente!',
            icon: 'success',
            confirmButtonText: 'Continuar'
        })
        //reinicializo el array con los valores originales
        resetArrBooks()

    })

    //función encargada de actualizar los cambios en el DOM, sección listado libros
    function renderContainer(arrBooks) {
        container.innerHTML = ""
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
            console.log(cards)
            container.append(cards)

            if (el.stock > 0) {
                //solo le agrego el evento si hay stock
                let buttonAddItem = document.getElementById(el.id)
                buttonAddItem.addEventListener("click", addItemBasket)
            }

        })
        renderCheckout()
    }

    //función encargada de filtrar los libros por coincidencia de título
    function filterByTitle() {
        let booksFilteredByTitle = books.filter(book => book.title.includes(inFinderByTitle.value))
        renderContainer(booksFilteredByTitle)
    }


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

        renderCheckout()
        renderContainer(books)
        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
            title: 'Éxito!',
            text: `Se agregó al carrito : ${book.title}`,
            icon: 'success',
            confirmButtonText: 'Continuar'
        })
    }

    function delItemBasket(e) {
        let id = e.target.id.split('_')[1]
        console.log("hiconer clic en quitar elemento " + id)
        //agrego al carrito, pero antes veo si tiene pedidos del mismo item. en ese caso, incremento count
        let itemInBasket = basket.find((book) => book.id == id) || []
        let tmpcount
        let book = books.find((el) => el.id == id)
        console.log("imprimo book en delItem:" + book + " id:" + id)

        //para que no me queden elementos duplicados en el array basket, busco el que está, lo borro y cargo el nuevo objeto
        let idxBasket = basket.findIndex(book => book.id == id)

        let basket_updated = basket.splice(idxBasket, 1)

        //TODO: Queda pendiente ver cómo actualizar el stock cuando borran un elemento del carriro.updateStock(book.id)

        //vacio el LS y lo vuelvo a cargar con la data actualizada
        localStorage.removeItem("basket")
        localStorage.setItem("basket", JSON.stringify(basket_updated))

        renderCheckout()
        renderContainer(books)
        // mostramos mensaje de error usando la librería sweetalert
        Swal.fire({
            title: 'Éxito!',
            text: `Se eliminó del carrito : ${book.title}`,
            icon: 'success',
            confirmButtonText: 'Continuar'
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
        //vacio el LS y lo vuelvo a cargar con la data actualizada
        // localStorage.removeItem("books")
        // localStorage.setItem("books",JSON.stringify(books))
    }
    //función encargada de renderizar el carrito
    function renderCheckout() {
        checkout.innerHTML = ""
        let total = 0
        if (basket.length > 0) {
            console.log("cantidad items carrito:" + basket.length)
            checkout.className = "checkoutFilled"
            checkout.innerHTML = `
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

            let buttonDelItem = document.getElementById(checkoutID)
            console.log(buttonDelItem)
            buttonDelItem.addEventListener("click", delItemBasket)

            total += item.subtotal

            }
            checkout.innerHTML += `<div class ="basket_total">Total:$${total}</div>`
        }
        
    }
}
resetArrBooks()