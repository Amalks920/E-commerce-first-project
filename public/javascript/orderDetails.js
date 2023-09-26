const productCancelBtns = document.querySelectorAll("#product-cancel");
const cancelProductModel = document.querySelector("#cancel-product-modal");
const exitProductBtn = document.querySelector("#exitBtnProduct");
const cancelProductBtn = document.querySelector("#cancelBtnProduct");
const cancellAllBtn=document.querySelector('#cancel-btn')
const modal = document.querySelector("#modalBgDeleteProd");
const orderId=document.querySelector('#orderId').value;
const minusBtns=document.querySelectorAll('.value-minus')
const plusBtns=document.querySelectorAll('.value-plus')
const qtyValue=document.querySelectorAll('.value')
const userId=document.querySelector('#userId').value;
console.log(qtyValue[0].textContent)
console.log(orderId)
let productId
let qty

productCancelBtns.forEach(function (cancelBtn, index) {
  cancelBtn.addEventListener("click", function (event) {
    qty=Number(qtyValue[index].textContent)
    console.log(qty)
   productId= cancelBtn.getAttribute('data-id')
    modal.style.display = "block";
    cancelProductModel.style.display = "block";
  });
});

exitProductBtn.addEventListener("click", function () {
  modal.style.display = "none";
  cancelProductModel.style.display = "none";
});

cancelProductBtn.addEventListener("click", function () {
  console.log(productId);
   cancelProduct(orderId,productId)
});

function cancelProduct(orderId,productId) {
  fetch(`/cancel-order/${orderId}?productId=${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status:"Cancelled",
      qty:qty
  }) 
  })
    .then((response) => response.json())
    .then((data) => {
      window.location = "http://localhost:5000/view-orders";
    })
    .catch((error) => console.error(error));
}


minusBtns.forEach(function (minusBtn,index) {
  minusBtn.addEventListener('click',function (){
    if(Number(qtyValue[index].textContent)>0){
      qtyValue[index].textContent=Number(qtyValue[index].textContent)-1
    }
  })
})

plusBtns.forEach(function (plusBtn,index) {

  plusBtn.addEventListener('click',function (){
    if( Number(qtyValue[index].textContent)<10){
      qtyValue[index].textContent=Number(qtyValue[index].textContent)+1
    }
  })
})


cancellAllBtn.addEventListener('click',function () {
  console.log(orderId)
  cancellAllOrders(orderId)
})


function cancellAllOrders (orderId) {
  fetch(`/cancel-order/${orderId}`,
  {
      method:'POST',
      headers: {
       'Content-Type': 'application/json',
        // You may need to include other headers like authorization tokens here
      },
      body: JSON.stringify({
      status:"Cancelled",
      user:userId
  }) 
  }
  
       )
  .then(response=>{response.json()})
  .then(data=>{
      
      location.reload(true)
      console.log(data)
  })
  .catch(error=>console.log(error))
 
} 
