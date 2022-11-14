/*Segunda entrega  de tu Proyecto final

Objetivos específicos

Capturar entradas mediante prompt().
Declarar variables y objetos necesarios para simular el proceso seleccionado.
Crear funciones y/o métodos para realizar operaciones (suma, resta, concatenación, división, porcentaje, etc).
Efectuar una salida, que es el resultado de los datos procesados, la cual puede hacerse por alert() o console.log().

Si bien, por el momento solo podemos hacer entradas con prompt() y salidas con alert() o console.log(), es suficiente para empezar a pensar el proceso a simular en términos de entradas, variables, estructuras, funciones, métodos y salidas. Verificar Rúbrica

Alumno: Javier De Luca
*/

// pedido de empanadas online. Solicita la cantidad, verifica stock, calcula precio total y decuenta stock

class Producto {
    constructor(id,nombre,precio,stock) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.stock = stock
    }
    actualizarStock(movimientoStock) {
        this.stock = this.stock + movimientoStock
    }
} 

function buscarEmpanadaPorId(id) {
    for (const empanada of empanadas) {
        if (empanada.id == id) {
            return empanada
        }
    }
}

function validarIdEmpanadaConStock(empanadasConStock,id){
    for (const empanada of empanadas) {
        if (empanada.id == id) {
            return true
        }
    }
    return false
}

function tomarPedido(empanadasConStock) {
    let menuOpciones = []
    let pedido = []
    //armo el menu con el listado de gustos disponibles
    for (const empanadaConStock of empanadasConStock) {
        menuOpciones.push(`${empanadaConStock.id}) ${empanadaConStock.nombre} - $${empanadaConStock.precio}\n`)        
    }
    //tomo el pedido
    let pedidoIdEmpanada=""
    do {
        //valido que el id de producto sea valido
        pedidoIdEmpanada = prompt(`Ingrese el id del gusto de empanada que quiere pedir, o FIN para terminar\n${menuOpciones}`)
        if (pedidoIdEmpanada.toUpperCase() != "FIN") {
            if (validarIdEmpanadaConStock(empanadasConStock,pedidoIdEmpanada)) {
                let pedidoEmpanada = buscarEmpanadaPorId(pedidoIdEmpanada)
                //ya tengo el producto, ahora solicito cantidad
                let pedidoCantidad = prompt(`Ingrese la cantidad de empandas de ${pedidoEmpanada.nombre}`)
                //valido el stock
                if (pedidoEmpanada.stock < pedidoCantidad) {
                    alert(`Lo sentimos, sólo tenemos en stock ${pedidoEmpanada.stock} empanadas de ${pedidoEmpanada.nombre}. Repita el pedido con la cantidad que desee`)   
                }else{
                    //agrego elemento al array de pedido
                    pedido.push({empanada:pedidoEmpanada,cantidad:pedidoCantidad})
                    //descuento del stock
                    pedidoEmpanada.actualizarStock(pedidoCantidad*-1)
                }   
            } else {
                alert("El id del gusto indicado no existe. Intente nuevamente")
            }
        } else {
            console.log("Termino la creación del pedido")
        }
    } while (pedidoIdEmpanada.toUpperCase() != "FIN");
    
    //si hay un pedido hecho, lo muestro en pantalla 
    if (pedido.length > 0) {
        console.log(`Resumen del pedido:\n`)
        let importeTotal =0
        for (const item of pedido) {
            console.log(`   Gusto: ${item.empanada.nombre} - cantidad: ${item.cantidad}`)
            importeTotal += (parseInt(item.empanada.precio) * item.cantidad)
        }
        console.log(`El total a pagar es de $${importeTotal}`)
    }
}
/*****************
 * 
 * PRINCIPAL
 * 
 * ***************/
    
//Creo los productos que voy a vender con su nombre, precio y cantidad de stock inicial
let empanadas = []

let empanadaJamonYqueso = new Producto(1,"Jamon y Queso",80,100)
empanadas.push(empanadaJamonYqueso)

let empanadaCarne = new Producto(2,"Carne",50,100)
empanadas.push(empanadaCarne)

let empanadaPollo = new Producto(3,"Pollo",60,100)
empanadas.push(empanadaPollo)


//Hago un listado de las empanadas que tienen stock y las muestro
let totalGustosEmpanadas = empanadas.length
let empanadaSinStock=0
let empanadasConStock = []
for (const empanada of empanadas) {
    if (empanada.stock > 0) {
        empanadasConStock.push(empanada)
    }else{
        empanadaSinStock++
    }
}
//En caso que la cantidad de gustos de empanadas sin stock sea igual a toda la variedad que tengo, indico que no puedo tomar el pedido
if (empanadaSinStock == totalGustosEmpanadas) {
    console.log("Nos quedamos sin stock, vuelva a hacer el pedido más tardes.")
} else {
    tomarPedido(empanadasConStock)
}