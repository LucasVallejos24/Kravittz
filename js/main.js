// guardamos todos los boton añadir al carrito en 'ClickButton'
const clickButton = document.querySelectorAll('.boton');
// Guardamos el elemento contenedor donde se mostrara la info de carrito
const tbody = document.querySelector('.tbody')

// array donde almacena los productos agregados al carrito
let carrito = [];

// recorremos la variables ya que son 5 botones guardados
clickButton.forEach(btn => {
    btn.addEventListener('click', addToCarrito)
    //                             ya añadimos la proxima funcion
})

// function declarada en el bucle clickButton
function addToCarrito(e) {
    const button = e.target; //devuelve el elemento DOM seleccionado
    //              .closest => va a devolver el elemento mas cercano a button(boton añadir), en este caso el contenedor de la card (.productoDestacado__card)
    const item = button.closest('.productoDestacado__card') //devuelve la card completa del boton seleccionado
    //            selecc. un elemento de item(card completa), es decir el titulo(.card-title), solo el txt con .textContent
    const itemTitle = item.querySelector('.card-title').textContent;
    //            selecc. un elemento de item(card completa), es decir el precio(.precio), solo el txt con .textContent
    const itemPrice = item.querySelector('.precio').textContent;
    const itemImg = item.querySelector('.card-img-top').src; //Lo mismo que title y precio, pero con la propiedad   .src

    // Objeto del producto
    const newProduct = {
        title: itemTitle,
        precio: itemPrice,
        img: itemImg,
        cantidad: 1 //cantidad 1, para asi cuando se agregue al carrito, ya tenga 1na cantidad
    }

    addProductCarrito(newProduct)
}

function addProductCarrito(newProduct) {

    //          2do paso
    const inputCarrito = tbody.getElementsByClassName('cantidad__input'); // seleccionamos el elemento input creado en la function renderCarrito()
    // recorremos cada uno de los productos del array carrito
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newProduct.title.trim()){ //verificamos el nombre del producto del carrito es === al nombre del producto a agregar
            carrito[i].cantidad ++; // En caso que se cumpla la condicion anterior, sumamos de a 1 la cantidad del producto en el carrito
            const inputValue = inputCarrito[i]; // guardamos en inputValue el elemento input (inputCarrito[i = elemento seleccionado del carrito])
            inputValue.value++; // Sumamos 1 al valor del value
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


    //      1er paso
    carrito.push(newProduct) // agregamos el producto creado en la function addToCarrito

    renderCarrito()
}
// function para mostrar el contenido del carrito
function renderCarrito() {
    tbody.innerHTML=''; // cada vez que se ejecute la function, empieze vacio el elemento
    carrito.map (item => {
        const tr = document.createElement('tr'); // creamos el <tr> para colocar dentro la info del producto
        tr.classList.add('productCarrito'); //agregamos una clase con el atr classList.add('nombre de la clase')
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

        tr.innerHTML = content; // dentro del <tr> creado, agregamos el valor de content
        tbody.append(tr) //agregamos al tbody(container el carrito) el tr

        tr.querySelector('.delete').addEventListener('click', removeProductCarrito); // Llamamos al btn delete del carrito y le asignamos un evento para eliminar
        tr.querySelector('.cantidad__input').addEventListener('change', sumaCantidad)// Accedemos al input de cantidad y le asignamos un evento para sumar y restar.
    })

    totalCarrito()
}

// Function para el total a mostrar en el carrito
function totalCarrito() {
    let total = 0; // Inicializamos el total en 0
    const priceTotal = document.querySelector('.producto__total'); // Guardamos el elemento que muestra el valor del total
    carrito.forEach((item) =>{ // Recorremos el carrito
        const precio = Number(item.precio.replace("Precio: $", '')); // Creamos la variable precio y le guardamos el valor de precio, transdormado a Number()
        total = total + precio*item.cantidad; // Hacemos la operación de precio * la cantidad de elementos agregados al carrito y le sumamos al total
    })

    priceTotal.innerHTML = `Total $${total}`; // Remplazamos el texto del carrito por el nuevo
    addLocalStorage()
}

//  Function para remover producto del carrito
function removeProductCarrito(e) {
    const buttonDelete = e.target; // Muestra el boton al cual hicimos click en el carrito
    const tr = buttonDelete.closest('.productCarrito'); // Llamamos al componenete padre
    const title = tr.querySelector('.productoCarrito__title').textContent; // Accedemos al elemento identificador, este caso el title

    // Recorremos el array carrito
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === title.trim()) { // Si el title del array carrito es === al title del producto agregado
            carrito.splice(i, 1); // Eliminamos el producto del array carrito
        }
    }
    tr.remove() // Ejecutamos la function de eliminar

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
            item.cantidad = sumaCantidadInput.value // Modificamos el valor de cantidad en el carrito
            totalCarrito(); // Actualizamos los datos para modificar el total del carrito
        }
    })
    console.log(carrito)
}

// Functiona para agregar al localStorage los elementos del array carrito
function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function() { // Cada vez que se actualiza la pag. ejecute la function
    const storage = JSON.parse(localStorage.getItem('carrito')); // Traemos los objetos guardados en el localStorage
    if (storage) { // Si existe storage
        carrito = storage; // Guardamos los elementos traidos del LocalStorage en el array carrito
        renderCarrito()
    }
}
