
//Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function() {

    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case '1' :
            cantidad = base * 1.15;
            break;
        case '2' :
            cantidad = base * 1.05;
            break;
        case '3' :
            cantidad = base * 1.35;
            break;
        default:
            break;
    }


    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //Cada año que la diferencia es mayor, el costo se reduce en 3%
    cantidad -=((diferencia * 3) * cantidad) / 100;

    if(this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

function UI() {
}

//Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear(),
    min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {

    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add( 'error');
    } else {
        div.classList.add('mensaje', 'correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    //Insertat en el HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
}

UI.prototype.mostrarResultado = (total, seguro) => {

    const {marca, year, tipo} = seguro;

    let textoMarca;

    switch(marca) {
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
                textoMarca = 'Asiatico';
                break;
            case '3':
                    textoMarca = 'Europeo';
                    break;        
        default:
            break;
    }

    //Crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class="header">Tu respuesta</p>
        <p class="font-bold">Marca: ${textoMarca}</p>
        <p class="font-bold">Año: ${year}</p>
        <p class="font-bold">Tipo: ${tipo}</p>
        <p class="font-bold">Total:$ ${total}</p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    //Mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none'; //borra spinner
        resultadoDiv.appendChild(div); //se muestra resultado
    }, 3000);
}

//instanciar UI
//el global
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); //LLena el select con los años
})

eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(evento){
    evento.preventDefault();

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    

    //leer el año seleccionado
    const year = document.querySelector('#year').value;

    //leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === '') {
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando', 'exito');

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if(resultados != null) {
        resultados.remove();
    }


    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //Utilizar el prototype que va a cotizar.
    ui.mostrarResultado(total, seguro);
}
