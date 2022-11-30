//como voy actualizando el stock a medida que se agregan items al carrito, guardo en LS para mantenerlo por si cierran el browser
let books = []
function resetArrBooks() {
    books = JSON.parse(localStorage.getItem("books")) || [{
        id: 1,
        title: "El poder de las palabras",
        author: "Sigman, Mariano",
        content_short: "Es posible cambiar; en cualquier momento de la vida; nuestras ideas más arraigadas; nuestra forma de pensar y también nuestra experiencia emocional. Para lograrlo es suficiente una herramienta sencilla y extremadamente efectiva en la transformación de nuestro cerebro: el buen uso de la conversac...",
        publisher: "Debate",
        publisher_date: "2022",
        pages: "352",
        language: "spanish",
        cover: "https://www.tematika.com/media/catalog/Ilhsa/Imagenes/697635.jpg",
        stock: 99,
        price: 4349
    },
    {
        id: 2,
        title: "Historias de la belle epoque argentina",
        author: "Balmaceda, Daniel",
        content_short: "Una invitación a recorrer los espléndidos años dorados de la Belle Époque argentina. De las últimas décadas del siglo XIX al Centenario de la Revolución de Mayo; en 1910; y los años previos a la Primera Guerra Mundial...",
        publisher: "Sudamericana",
        publisher_date: "2022",
        pages: "384",
        language: "spanish",
        cover: "https://www.tematika.com/media/catalog/Ilhsa/Imagenes/699579.jpg",
        stock: 1,
        price: 4099
    },
    {
        id: 3,
        title: "Horoscopo chino 2023",
        author: "Squirru Dari, Ludovica",
        content_short: "El nuevo libro de predicciones de la astróloga best seller Ludovica Squirru Dari para el 2023; año del Conejo de agua...",
        publisher: "Grupo Zeta",
        publisher_date: "2022",
        pages: "448",
        language: "spanish",
        cover: "https://www.tematika.com/media/catalog/Ilhsa/Imagenes/698681.jpg",
        stock: 2,
        price: 2999
    },
    {
        id: 4,
        title: "Violeta",
        author: "Allende, Isabel",
        content_short: "La épica y emocionante historia de una mujer cuya vida abarca los momentos históricos más relevantes del siglo XX. Desde 1920 -con la llamada «gripe española»- hasta la pandemia de 2020; la vida de Violeta será mucho más que la historia de un siglo...",
        publisher: "Sudamericana",
        publisher_date: "2022",
        pages: "400",
        language: "spanish",
        cover: "https://www.tematika.com/media/catalog/Ilhsa/Imagenes/690814.jpg",
        stock: 0,
        price: 5449
    }
]
}

//me traigo del DOM los elementos que voy a modificar
let container = document.getElementById("container")
let checkout = document.getElementById("checkout")

//Si la lista del localStorage esta vacia, la defino sin elementos
let basket = JSON.parse(localStorage.getItem("basket")) || []
//inicializo el array books
resetArrBooks()

//si el carrito tiene elementos, le piso la clase default que lo oculta
if (basket.length > 0) { 
    checkout.className = "checkoutFilled"
    renderCheckout()
}

//agrego funcionalidad de filtrado de los libros que se muestran según el título
let inFinderByTitle = document.getElementById("inFinderByTitle")
inFinderByTitle.addEventListener("input",filterByTitle)
renderContainer(books)

//agrego funcionaidad para vaciar carrito
let btnEmptyBasket = document.getElementById("emptyBasket")
btnEmptyBasket.addEventListener("click", () => {
    //dejo en 0 la lista del carrito
    basket = []
    //vacío la key que tengo en el LS para los items del carrito
    localStorage.removeItem("basket")
    //vacío la key de books que tengo en LS, ya que se libera el stock
    localStorage.removeItem("books")
    //renderizo para que el DOM esté actualizado
    btnEmptyBasket.className="emptyBasket"
    renderCheckout()
    //reinicializo el array con los valores originales
    resetArrBooks()
    renderContainer(books)

    alert("Carrito vaciado exitosamente!")    
})

//función encargada de actualizar los cambios en el DOM, sección listado libros
function renderContainer(arrBooks){
    container.innerHTML=""
    arrBooks.forEach(el => {
        let cards = document.createElement("div")
        let buttonClass = "btnAddItemBasquet"
        
        //defino el estilo según existencia de stock
        if (el.stock > 0) {
            cards.className= "cards"
        } else {
            cards.className= "cardsSoldout"
            //si no hay stock, deshabilito el boton de agregar al carrito
            buttonClass = "btnAddItemBasquet buttonDisabled"
        }

        cards.innerHTML = `
            <div>
                <h3>Título:${el.title}</h3>
                <h4>Autor:${el.author}</h4>
                <h4>Disponibilidad: ${el.stock > 0 ? el.stock+" u" :"Agotado"}</h4>
                <h3>Precio:$${el.price}</h3>
                <img src =${el.cover}>
                <button class="${buttonClass}" id=${el.id}>Agregar al carrito</button>
            </div>`        
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
    let itemInBasket = basket.find( (book) => book.id == e.target.id)|| []
    let tmpcount
    let book = books.find((el) => el.id == e.target.id)

    //me fijo si ya tiene algún item de este id
    itemInBasket.length == 0 ? tmpcount = 1 : tmpcount = itemInBasket.count+1

    //para que no me queden elementos duplicados en el array basket, busco el que está, lo borro y cargo el nuevo objeto
    let idxBasket = basket.findIndex(book => book.id == e.target.id)

    if (idxBasket != -1) {
      basket[idxBasket] = {
        id: basket[idxBasket].id, title: basket[idxBasket].title, author: basket[idxBasket].author, price: basket[idxBasket].price, count: basket[idxBasket].count + 1, subtotal: (basket[idxBasket].price * (basket[idxBasket].count + 1))
      }
    } else {
      basket.push({
        id: book.id, title: book.title, author: book.author,price: book.price, count: 1, subtotal: book.price
      })
    }
    updateStock(book.id)

    //vacio el LS y lo vuelvo a cargar con la data actualizada
    localStorage.removeItem("basket")
    localStorage.setItem("basket",JSON.stringify(basket))
    
    renderCheckout()
    renderContainer(books)
}
//funcion encargada de actualizar el stock de libros
function updateStock(bookId){
    let idxBook = books.findIndex(book => book.id == bookId)
    if (idxBook != -1) {
        books[idxBook] = {
        id: books[idxBook].id, title: books[idxBook].title, author: books[idxBook].author, content_short: books[idxBook].content_short , publisher: books[idxBook].publisher,publisher_date: books[idxBook].publisher_date,pages: books[idxBook].pages,lenguage: books[idxBook].lenguage,cover: books[idxBook].cover,stock: books[idxBook].stock -1, price: books[idxBook].price
      }
    }
    //vacio el LS y lo vuelvo a cargar con la data actualizada
    localStorage.removeItem("books")
    localStorage.setItem("books",JSON.stringify(books))
}
//función encargada de renderizar el carrito
function renderCheckout(){
    checkout.className="checkoutFilled"
    checkout.innerHTML=""
    for (const item of basket) {
        checkout.innerHTML += `
        <div>
            <h3>Título:${item.title}</h3>
            <h4>Autor:${item.author}</h4>
            <h3>Precio:$${item.price}</h3>
            <h3>Cantidad:$${item.count}</h3>
            <h3>Subtotal:$${item.subtotal}</h3>
        </div>`
    }
    if (basket.length > 0) {
        //hacemos aparecer devuelta el boton de vaciar carrito
        let btnEmptyBasket = document.getElementById("emptyBasket")
        btnEmptyBasket.className="filledBasket"
    }
}