
const clickButton = document.querySelectorAll('.boton');
const tbody = document.querySelector('.tbody')

// array donde almacena los productos agregados al carrito
let carrito = [];

clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarrito)
})

function addToCarrito(e) {
    const button = e.target; 
    const item = button.closest('.productoDestacado__card')
    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src; 

    // Objeto del producto
    const newProduct = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1 
    }

    addProductCarrito(newProduct)
}

function addProductCarrito(newProduct) {

    const inputCarrito = tbody.getElementsByClassName('cantidad__input'); 
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newProduct.title.trim()){ 
            carrito[i].cantidad ++; 
            const inputValue = inputCarrito[i]; 
            inputValue.value++; 
            totalCarrito();
            return null; // Este return sirve para que se ejecute desde la function directamente y no del renderCarrito()
        }
    }

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();


    
    carrito.push(newProduct) // agregamos el producto creado en la function addToCarrito

    renderCarrito()
}
// function para mostrar el contenido del carrito
function renderCarrito() {
    tbody.innerHTML=''; 
    carrito.map (item => {
        const tr = document.createElement('tr'); 
        tr.classList.add('productCarrito'); 
        const content = `
            <th scope="row">1</th>
			<td class="table__productos">
				<img src= ${item.img} alt="">
				<p class="productoCarrito__title">${item.title}</p>
			</td>
			<td class="table__precio"><p>${item.precio}</p></td>
			<td class="table__cantidad">
				<input type="number" class="cantidad__input" min="1" value=${item.cantidad}>
				<button class="delete btn btn-danger ">X</button>
			</td>
        `

        tr.innerHTML = content; 
        tbody.append(tr) 

        tr.querySelector('.delete').addEventListener('click', removeProductCarrito); // Llamamos al btn delete del carrito y le asignamos un evento para eliminar
        tr.querySelector('.cantidad__input').addEventListener('change', sumaCantidad)// Accedemos al input de cantidad y le asignamos un evento para sumar y restar.
    })

    totalCarrito()
}

// Function para el total a mostrar en el carrito
function totalCarrito() {
    let total = 0; // Inicializamos el total en 0
    const priceTotal = document.querySelector('.producto__total');
    carrito.forEach((item) =>{ 
        const precio = Number(item.precio.replace("Precio: $", '')); 
        total = total + precio*item.cantidad;                                    
    })

    priceTotal.innerHTML = `Total $${total}`; 
    addLocalStorage()
}

//  Function para remover producto del carrito
function removeProductCarrito(e) {
    const buttonDelete = e.target; 
    const tr = buttonDelete.closest('.productCarrito'); 
    const title = tr.querySelector('.productoCarrito__title').textContent; 

    
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === title.trim()) { 
            carrito.splice(i, 1); 
        }
    }
    tr.remove() 

    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #9e1200, #f05930)",
        },
        onClick: function(){} // Callback after click
      }).showToast();

    totalCarrito() // Actualiza los datos para modificar el total del carrito
}

// Evento para sumar la cantidad del input
function sumaCantidad (e) {
    const sumaCantidadInput = e.target;
    const tr = sumaCantidadInput.closest('.productCarrito');
    const title = tr.querySelector('.productoCarrito__title').textContent;

    carrito.forEach(item => {
        if(item.title.trim() === title) {
            sumaCantidadInput.value < 1? (sumaCantidadInput.value = 1) :sumaCantidadInput.value; // Si la cant. es menor a 1, le decimos que que empieze en 1.
            item.cantidad = sumaCantidadInput.value 
            totalCarrito(); 
        }
    })
    console.log(carrito)
}

// Function para agregar al localStorage los elementos del array carrito
function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

let divContainer = document.getElementById('divContainer');

async function mostrarFooter() {
    let footer = await fetch('./JSON/footer.json');
    let footerJSON = await footer.json();
    return footerJSON
}

window.onload = function() { // Cada vez que se actualiza la pag. ejecute la function
    const storage = JSON.parse(localStorage.getItem('carrito')); // Traemos los objetos guardados en el localStorage
    if (storage) { 
        carrito = storage; // Guardamos los elementos traidos del LocalStorage en el array carrito
        renderCarrito()
    }

    mostrarFooter().then(mostrar => {
        divContainer.innerHTML+= `
        <div class="row text-white">
             <h4 class="col-4 text-reset text-uppercase d-flex align-items-center">${mostrar[0].logo}</h4>
             <ul class="col-4 list-unstyled">
                 <li class="font-weigth-bold text-uppercase"><h4 class="text-white">Horario y contacto</h4></li>
                 <li class="text-reset">${mostrar[1].horario1}</li>
                 <li class="text-reset">${mostrar[1].horario2}</li>
                 <li class="text-reset">${mostrar[2].contacto}</li>
             </ul>
             <ul class="col-4 list-unstyled fs-1">
                <li class="font-weigth-bold text-uppercase"><h4 class="text-white">Redes</h4></li>
                <li>${mostrar[3].instagram}</li>
                <li>${mostrar[3].whatsapp}</li>
             </ul>
         </div>
        `
    })
}
