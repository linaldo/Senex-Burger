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


// Verificar se o restaurante está aberto - Quarta a Domingo das 19h às 01h
// Verificar se o restaurante está aberto - Quarta a Domingo das 19h às 01h
function checkRestaurantOpen() {
    const data = new Date();
    const dia = data.getDay();  
    const hora = data.getHours();

    const diaAberto = (dia >= 3 && dia <= 6) || dia === 0; 
    const horaAberta = (hora >= 19) || (hora < 1);

    return diaAberto && horaAberta;
}

// Verificar se o restaurante está aberto - Terça das 11h às 19h
function checkRestaurantOpenTuesday() {
    const data = new Date();
    const dia = data.getDay();  
    const hora = data.getHours();

    const diaAberto = dia === 2; 
    const horaAberta = hora >= 11 && hora < 19;

    return diaAberto && horaAberta;
}

// Atualiza o status do funcionamento (Quarta a Domingo)
function updateStatus() {
    const statusDiv = document.getElementById('status');
    const spanItem = document.getElementById("date-span");
    const isOpen = checkRestaurantOpen();

    if (isOpen) {
        statusDiv.textContent = '4ª a Dom das 19:00 às 01:00 (Estamos aberto)';
        spanItem.classList.remove("bg-red-500");
        spanItem.classList.add("bg-green-600");
    } else {
        statusDiv.textContent = 'Estamos fechados. Funcionamos de 4ª a Dom das 19:00 às 01:00';
        spanItem.classList.remove("bg-green-600");
        spanItem.classList.add("bg-red-500");
    }

    statusDiv.classList.add('text-white',  'text-center');
}

// Atualiza o status do funcionamento (Terça)
function updateStatusTuesday() {
    const spanItem1 = document.getElementById("date-span1");
    const isOpen = checkRestaurantOpenTuesday();

    if (isOpen) {
        spanItem1.classList.remove("bg-red-500");
        spanItem1.classList.add("bg-green-600");
    } else {
        spanItem1.classList.remove("bg-green-600");
        spanItem1.classList.add("bg-red-500");
    }
}

// Atualiza assim que carregar
updateStatus();
updateStatusTuesday();

// (Opcional) Se quiser atualizar automaticamente a cada minuto:
setInterval(() => {
    updateStatus();
    updateStatusTuesday();
}, 60000);




