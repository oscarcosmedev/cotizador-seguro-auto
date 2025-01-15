
// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca
    this.year = year
    this.tipo = tipo
}

// Realiza la cotización con los datos
Seguro.prototype.cotizarSeguro = function() {
    /**
     * 1 = Americano 1.15
     * 2 = Asiatico 1.05
     * 3 = Europeo 1.35
     */

    let cantidad
    const precioBase = 2000

    switch(this.marca) {
        case '1': 
            cantidad = precioBase * 1.15
            break
        case '2': 
            cantidad = precioBase * 1.05
            break
        case '3': 
            cantidad = precioBase * 1.35
            break
        default: 
            break
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year
    
    // Cada año que la diferencia es mayor, el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100
    console.log(cantidad)

    /**
     * Si el seguro es Básico, se multiplica por un 30% +
     * Si el seguro es Completo, se multiplica por un 50% +
     */

    if(this.tipo === 'basico') {
        cantidad *= 1.30
    } else {
        cantidad *= 1.50
    }

    return cantidad

}

function UI(){}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const   max = new Date().getFullYear(),
            min = max - 20
    
    const selectYear = document.querySelector('#year')

    for( let i = max; i > min; i-- ) {
        let option = document.createElement('option')
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option)
    }

}

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipoMensaje) => {
    
    const div = document.createElement('div')

    if(tipoMensaje === 'error') {
        div.classList.add('error')
    } else {
        div.classList.add('correcto')
    }

    div.classList.add('mensaje', 'mt-10')
    div.textContent = mensaje

    // Insertar en el HTML
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.insertBefore(div, document.querySelector('#resultado'))

    // Eliminamos el mensaje luego de 3s
    setTimeout(() => {
        div.remove()
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo} = seguro

    let nombreMarca

    switch(marca) {
        case '1': 
            nombreMarca = 'Americano'
            break
        case '2':
            nombreMarca = 'Asiatico'
            break
        case '3':
            nombreMarca = 'Europeo'
            break
        default: break
    }

    const div = document.createElement('div')
    div.classList.add('mt-10')

    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${nombreMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo de Seguro: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
    `

    const resultadoDiv = document.querySelector('#resultado')
    // resultadoDiv.appendChild(div)

    // Mostrar el spinner
    const spinner = document.querySelector('#cargando')
    spinner.style.display = 'block'

    setTimeout(() => {
        spinner.style.display = 'none'
        resultadoDiv.appendChild(div)
    }, 3000);
    
}

// instanciar UI
const ui = new UI()
// console.log(ui)


document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones() // Llena el select de Año
})



// escuchamos
eventListeners()
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro')
    formulario.addEventListener('submit', cotizarSeguro)
}

function cotizarSeguro(e) {
    e.preventDefault()

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value

    // Leer el año seleccionado
    const year = document.querySelector('#year').value

    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value

    if(marca === '' || year === '' || tipo === '') {
        // console.log('no paso la validación')
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error')
        return
    }

    // Si pasa la validación
    ui.mostrarMensaje('Cotizando ...', 'correcto')

    // Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div')
    if(resultados != null) {
        resultados.remove()
    }

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo)
    // console.log(seguro)

    const total = seguro.cotizarSeguro()
    // console.log(total)


    // Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro)
}