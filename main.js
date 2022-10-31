/*Primera entrega  de tu Proyecto final

Crear un algoritmo con un condicional.
Crear un algoritmo utilizando un ciclo.

Alumon: Javier De Luca
*/

function esMesValido(mes) {
    //recibo parametro en lowercase
    switch (mes) {
        case "enero":
        case "febrero":
        case "marzo":
        case "abril":
        case "mayo":
        case "junio":
        case "julio":
        case "agosto":
        case "septiembre":
        case "setiembre":
        case "octubre":
        case "noviembre":
        case "diciembre":        
            return true    
            break;
        default:
            console.log("El mes ingresado es incorrecto, verifique y vuelva a intentar")
            return false
            break;
    }
}

function esDiaValido(dia) {
    if (dia > 0 && dia <= 31 ) {
        return true
    } else {
        console.log("El dia ingresado es incorrecto, verifique y vuelva a intentar")
        return false
    }

}

function averiguarSigno(mes,dia) {
    // Acuario (21 de enero / 18 de febrero)
    if ((mes == "enero" && dia >=21) || (mes == "febrero" && dia <=18 )) {
        return "acuario"
    // Piscis (19 de febrero / 20 de marzo)
    } else if ((mes == "febrero" && dia >=19) || (mes == "marzo" && dia <=20 )) {
        return "piscis"
    // Aries (21 de marzo / 20 de abril)    
    } else if ((mes == "marzo" && dia >=21) || (mes == "abril" && dia <=20 )) {
        return "aries"    
    // Tauro (21 de abril / 21 de mayo)
    } else if ((mes == "abril" && dia >=21) || (mes == "mayo" && dia <=21 )) {
        return "tauro"
    // Géminis (22 de mayo / 21 de junio)
    } else if ((mes == "mayo" && dia >=22) || (mes == "junio" && dia <=21 )) {
        return "géminis"
    // Cáncer (22 de junio / 22 de julio)
    } else if ((mes == "junio" && dia >=22) || (mes == "julio" && dia <=22 )) {
        return "cáncer"
    // Leo (23 de julio / 23 de agosto)    
    } else if ((mes == "julio" && dia >=23) || (mes == "agosto" && dia <=23 )) {
        return "leo"
    // Virgo (24 de agosto / 23 de septiembre)    
    } else if ((mes == "agosto" && dia >=24) || (mes == "septiembre" && dia <=23 ) || (mes == "setiembre" && dia <=23 )) {
        return "virgo"
    // Libra (24 de septiembre / 23 de octubre)    
    } else if ( (mes == "septiembre" && dia >=24 ) || (mes == "setiembre" && dia >=24 ) || (mes == "octubre" && dia <=23)) {
        return "libra"
    // Escorpión (24 de octubre / 22 de noviembre)
    } else if ( (mes == "octubre" && dia >=24 ) || (mes == "noviembre" && dia <=22)) {
        return "escorpio"
    // Sagitario (23 de noviembre / 21 de diciembre)
    } else if ( (mes == "noviembre" && dia >=23 ) || (mes == "diciembre" && dia <=21)) {
        return "sagitario"
    // Capricornio (22 de diciembre / 20 de enero)    
    } else if ( (mes == "diciembre" && dia >=22 ) || (mes == "enero" && dia <=20)) {
        return "capricornio"
    } else {
        return "No existis en el horoscopo"
    }
}
//defino las dos variables que voy a usar dentro del do while
let mes
let dia

// solicito el mes de nacimiento
do {
    mes = prompt("Ingrese el mes de su nacimiento, ejemplo: enero").toLowerCase()
} while (!esMesValido(mes));

// solicito el día de nacimiento
do {
    dia = parseInt(prompt("Ingrese el dia de su nacimiento, ejemplo: 1"))
} while (!esDiaValido(dia));

// obtengo el signo a partir de la funcion averiguarSigno
let signo = averiguarSigno(mes,dia)
console.log("Tu signo es "+signo)