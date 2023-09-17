const productCancelBtn=document.querySelector('#product-cancel');
const cancelProductModel=document.querySelector('#cancel-product-modal')
const exitProductBtn=document.querySelector('#exitBtnProduct');
const cancelProductBtn=document.querySelector('#cancelBtnProduct')
const modal=document.querySelector('#modalBgDeleteProd')



productCancelBtn.addEventListener('click',function (event) {

modal.style.display="block";
cancelProductModel.style.display="block"
   
   
})

exitProductBtn.addEventListener('click',function () {
  
    modal.style.display="none";
    cancelProductModel.style.display="none"

})

cancelProductBtn.addEventListener('click', function () {

})



