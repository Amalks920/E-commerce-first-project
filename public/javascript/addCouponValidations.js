
const promocodeInput=document.querySelector('#code');
const submitForm=document.querySelector('#submit-form');
const selectElement = document.querySelector('select[name="discountType"]');
const descriptionInput=document.querySelector('#description');
const discountAmount=document.querySelector('#discountAmount');
const minimumAmount=document.querySelector('#minimumAmount');
const maxRedemptions=document.querySelector('#maxRedemptions');

const selectedValue = selectElement.value;
let isValid;

selectElement.addEventListener('change',function () {
    if(selectElement.value==="") isValid=false
})

//validate promocode
function validatePromoCode(value){
   let promocodeRegExp=/^[A-Z][A-Z0-9]{5,}$/
    
   return promocodeRegExp.test(value)
  
}

promocodeInput.addEventListener('input',function(event){
    isValid=validatePromoCode(promocodeInput.value) 
    if(isValid){
        promocodeInput.style.border='1px solid green'
    }else{
        if(promocodeInput.value==="") promocodeInput.style.border='none'
        else promocodeInput.style.border='1px solid red'
        
    }
})

selectElement.addEventListener('input',function () {
    if(selectElement.value!="") selectElement.style.border='none';
})

descriptionInput.addEventListener('input',function () {
    if(descriptionInput.value!="") descriptionInput.style.border='none';
})








submitForm.addEventListener('submit',function(event){
    if(selectElement.value==="") {
        selectElement.style.border="1px solid red"
    }

    if(promocodeInput.value===""){
        promocodeInput.style.border='1px solid red'
    }

    if(descriptionInput.value===""){
        descriptionInput.style.border="1px solid red"
    }

    if(discountAmount.value===""){
        discountAmount.style.border="1px solid red"
    }

    if(maxRedemptions.value===""){
        maxRedemptions.style.border="1px solid red"
    }

    if(minimumAmount.value===""){
        minimumAmount.style.border="1px solid red"
    }

    if(!isValid)event.preventDefault()


})


const yesterday=new Date();
yesterday.setDate(yesterday.getDate()-1);

const formatedYesterDay=yesterday.toISOString().slice(0,16);
document.getElementById('expirationDate').setAttribute('min',formatedYesterDay)