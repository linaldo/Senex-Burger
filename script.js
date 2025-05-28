const menu = document.getElementById ("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("card-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCount = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")



let cart=[];



// Esse trecho é para abrir o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
    

})

// Fechar o modal quando click fora 

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }

})

// Fechar o modal quando click no botam fechar 

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    //console.log(event.target)
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))

    //adicionar no carrinho 

    addToCart(name,price)

    }
   
})

// Função para adicionar no carrinho 

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    
    if(existingItem){
 // se o item já existe, aumenta apenas a quantidade + 1 

        existingItem.quantity += 1;
    } else{
    cart.push({
        name,
        price,
        quantity:1,
    })

    }

    

    updateCartModal()

}

//Atualiza o carrinho

function updateCartModal(){
    cartItemsContainer.innerHTML="";
    let total = 0;


    cart.forEach(item => {
       const cartItemElement = document.createElement("div");
       cartItemElement.classList.add("flex", "justify-between","mb-4", "flex-col") 
      
      
       cartItemElement.innerHTML = `
    <div class="flex items-center  justify-between ">
        <div>
            <p class="font-extrabold" >${item.name} </p>
            <p>Qts: ${item.quantity}</p>
            <p class= "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>

        </div>

      
        <button class="remove-from-cart-btn" data-name="${item.name}" bg-red-600 text-white rounded-md flex-col px-4 py-1" >
          Remover
        </button>
     
    </div>
       
       `
    total+= item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement)

    })

 cartTotal.textContent= total.toLocaleString("pt-BR",{
    style: "currency",
    currency: "BRL"
 } );


 cartCount.innerHTML = cart.length;
}



// função para remover intem do carrinnho 

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})


function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1 ){
      const item = cart[index];
      
      if(item.quantity >1){
        item.quantity -=1;
        updateCartModal();
        return;
      }

      cart.splice(index, 1 );
      updateCartModal();
    }
}

//Pegar o que foi digitado ( o endereço )

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})


//Logica de finalizar carrinho 

checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0 ) return;
    if(addressInput.value == ""){
       addressWarn.classList.remove("hidden") 
       addressInput.classList.add("border-red-500")
       return;
    }
})


//finalizar pedido 

checkoutBtn.addEventListener("click", function(){

    const isOpen= checkRestaurantOpen();
   if(!isOpen){
      Toastify({
  text: "Estamos fechados ",
  duration: 3000,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  stopOnFocus: true, // Prevents dismissing of toast on hover
  style: {
    background: "#ef4444",
  },
  onClick: function(){} // Callback after click
}).showToast();
    return;
    }

    if(cart.length === 0) return;
    if(addressInput.value===""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats

    const cartItems = cart.map((item) => {
        return(
            `${item.name} quantidade: (${item.quantity}) preço:R$ ${item.price}|` 
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "+5581992902397"

    window.open(`https://wa.me/${phone}?text=${message} endereço: ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();

})

// Verificar se o restaurante está aberto - Quarta a Domingo das 19h às 01h
function checkRestaurantOpen() {
    const data = new Date();
    const dia = data.getDay();  // 0 = Domingo, 1 = Segunda ... 6 = Sábado
    const hora = data.getHours();

    // Verifica se está entre 19h e 23h59 no mesmo dia
    const horarioNoturno = hora >= 19 && hora <= 23;

    // Verifica se está entre 00h e 01h (madrugada do dia seguinte)
    const madrugada = hora >= 0 && hora < 1;

    // Se for entre quarta (3) e domingo (0)
    const diaSemana = (dia >= 3 && dia <= 6);  // Quarta a Sábado

    // Madrugada de quinta (4), sexta (5), sábado (6) e domingo (0) até 01h da manhã
    const diaMadrugadaValido = (dia >= 4 && dia <= 0) || dia === 0;

    if ((diaSemana && horarioNoturno) || (madrugada && (dia === 4 || dia === 5 || dia === 6 || dia === 0))) {
        return true;
    }

    // Verifica se é madrugada de segunda (01h) ainda do domingo
    if (dia === 1 && madrugada) {
        return false;
    }

    return false;
}


// ==============================
// Configuração dos horários
// ==============================

// Unidade 1: Quarta a Domingo das 19h até 01h
const horariosUnidade1 = [
    { dias: [3, 4, 5, 6, 0], horarioInicio: 19, horarioFim: 1 }
];

// Unidade 2: Terça das 11h às 19h
const horariosUnidade2 = [
    { dias: [2], horarioInicio: 11, horarioFim: 19 }
];

// ==============================
// Função genérica para checar aberto
// ==============================

function estaAberto(horarios) {
    const agora = new Date();
    const dia = agora.getDay();
    const hora = agora.getHours();

    for (const horario of horarios) {
        if (horario.dias.includes(dia)) {
            // Caso horário não passe da meia-noite
            if (horario.horarioInicio < horario.horarioFim) {
                if (hora >= horario.horarioInicio && hora < horario.horarioFim) {
                    return true;
                }
            } else {
                // Caso passe da meia-noite (ex.: 19h até 01h)
                if (hora >= horario.horarioInicio || hora < horario.horarioFim) {
                    return true;
                }
            }
        }
    }

    return false;
}

// ==============================
// Atualizar status Unidade 1
// ==============================

function updateStatusUnidade1() {
    const span = document.getElementById("date-span");
    const statusDiv = document.getElementById("status");

    const aberto = estaAberto(horariosUnidade1);

    if (aberto) {
        span.textContent = "ABERTO";
        span.classList.remove("bg-red-500");
        span.classList.add("bg-green-600");
         statusDiv.classList.remove("bg-red-500");
        statusDiv.classList.add("bg-green-600");

        statusDiv.textContent  = "De Quarta a Domingo das 19h às 01h.";
    } else {
        span.textContent = "FECHADO";
        span.classList.remove("bg-green-600");
        span.classList.add("bg-red-500");
        statusDiv.classList.remove("bg-green-600");
        statusDiv.classList.add("bg-red-500");

        statusDiv.textContent = "Funcionamos de Quarta a Domingo das 19h às 01h.";
    }
}

// ==============================
// Atualizar status Unidade 2
// ==============================

function updateStatusUnidade2() {
    const span = document.getElementById("date-span1");
    const statusDiv = document.getElementById("status2");
    
    const aberto = estaAberto(horariosUnidade2);

    if (aberto) {
        span.textContent = "ABERTO";
        span.classList.remove("bg-red-500");
        span.classList.add("bg-green-600");
        statusDiv.classList.remove("bg-red-500");
        statusDiv.classList.add("bg-green-600");

        statusDiv.textContent = "Toda Terça das 11h às 19h.";
    } else {
        span.textContent = "FECHADO";
        span.classList.remove("bg-green-600");
        span.classList.add("bg-red-500");
        statusDiv.classList.remove("bg-green-600");
        statusDiv.classList.add("bg-red-500");

        statusDiv.textContent = "Aberto toda Terça das 11h às 19h.";
    }
}

// ==============================
// Inicializar e atualizar periodicamente
// ==============================

function atualizarTodosStatus() {
    updateStatusUnidade1();
    updateStatusUnidade2();
}

// Atualiza ao carregar
atualizarTodosStatus();

// Atualiza a cada 1 minuto
setInterval(atualizarTodosStatus, 60000);





