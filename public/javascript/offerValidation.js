
const offerForm = document.getElementById("offerForm");
const offerNameInput = document.getElementById("offerName");
const productCategorySelect = document.querySelector(
  'select[name="offerType"]'
);
const descriptionInput = document.getElementById("description");
const discountInput = document.getElementById("discount");
const stockInput = document.getElementById("stock");
const imagesInput = document.querySelector('input[type="file"]');
const submitButton = document.querySelector('button[type="submit"]');
const offerType=document.querySelector('#offerType')
const discountType=document.querySelector('#discountType')
// const imageInput = document.getElementById("fileInput");
// const imagePreview = document.getElementById("imgPreview");
// const imageContainer = document.getElementById("images");
// const imageCropContainer = document.getElementById("image-crop");
// const cropSubmitBtn = document.getElementById("crop-submit");
// const cropContainer = document.getElementById("crpImg");
// const crpBtn=document.getElementById('crpBtn')


//     let imageCount = 0;


//     function validateFiles(input) {
//       const files = input.files;
  
//       for (let i = 0; i < files.length; i++) {
//           const file = files[i];
//           console.log(file)
//           const fileType = file.type;

//           // Check if the file type is an image (you can add more image types as needed)
//           if (fileType.startsWith('image/')) {
//               // File is an image
//               console.log(`File ${file.name} is an image.`);
//               return true
//           } else {
//               // File is not an image
//               console.log(`File ${file.name} is not an image.`);
//               return false
//           }
//       }
//   }

offerForm.addEventListener('submit',function(event){
  let isValid=true;
    // Reset previous error messages
    offerNameInput.classList.remove('is-invalid');

    // productCategorySelect.classList.remove('is-invalid');
    descriptionInput.classList.remove('is-invalid');
    discountInput.classList.remove('is-invalid');
    offerType.classList.remove('is-invalid');
    // imagesInput.classList.remove('is-invalid');
    
    
          // Perform validation for each field
    if (offerNameInput.value.trim() === '' || !validateOfferName(offerNameInput.value.trim())) {
      isValid = false;
      offerNameInput.classList.add('is-invalid');
    }

    // if (productCategorySelect.value === '1') {
    //     isValid = false;
    //     productCategorySelect.classList.add('is-invalid');
    // }

    if (descriptionInput.value.trim() === '' || !validateDescription(descriptionInput.value.trim())) {
        isValid = false;
        descriptionInput.classList.add('is-invalid');
    }
    console.log(discountInput.value)
    
    if (discountInput.value ==="") {
        isValid = false;
        discountInput.classList.add('is-invalid');
    }
   
    if (offerType.selectedIndex===0) {
        isValid = false;
        offerType.classList.add('is-invalid');
    }

    if (discountType.selectedIndex===0) {
        isValid = false;
        discountType.classList.add('is-invalid');
    }

    // if (isNaN(stockInput.value) || parseInt(stockInput.value) < 0) {
    //     isValid = false;
    //     stockInput.classList.add('is-invalid');
    // }

    // if(!validateFiles(imagesInput)){
    //   isValid = false;
    //   imagesInput.classList.add('is-invalid');
    // }
    
    // if (imagesInput.files.length === 0) {
    //     isValid = false;
    //     imagesInput.classList.add('is-invalid');
    // }

    if (!isValid) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
    
})

// cropSubmitBtn.addEventListener("click", () => {
//   imageCropContainer.style.display = "none";
// });

// imagesInput.addEventListener("change", () => {
//   const files = imageInput.files;
//   console.log(files[0])
//   if (imageCount < 3) {
//     const reader = new FileReader();

//     reader.onload = function (event) {
//       const img = document.createElement("img");
//       img.src = event.target.result;
//       img.alt = "Image " + (imageCount + 1);

     

//       imageContainer.appendChild(img);
//       imageCount++;

//       // Clear the input field after selecting an image
//       imagesInput.value = "";
//     };
//     if (files.length > 0) {
//       reader.readAsDataURL(files[0]);
//     }
//   } else {
//     alert("You can upload a maximum of three images.");
//     // Clear the input field to prevent further selection
//     imagesInput.value = "";
//   }
// });

// imageContainer.addEventListener('click',(event)=>{
//   if(event.target.tagName==="IMG"){
//     cropImg(event.target)
   
//     crpBtn.style.display="block"
//   }
// })

// images.forEach(image=>{
//   console.log(image)
//   image.addEventListener('click',()=>{
//     console.log(image)
//   })
// })

// img.addEventListener("click", function () {
        // console.log(img)
        //call function to create a modal
      //  imageCropModal(img.src);
   //   });


function imageCropModal(img) {
  // cropContainer.src = imgSrc;
  // console.log(crop)
  // const newImg=document.createElement('img')
  // newImg.src=img.src
  // newImg.id="crpImg"
  // console.log(imageCropContainer.removeChild(imageCropContainer.lastChild))
  // imageCropContainer.style.display = "block";
  // imageCropContainer.appendChild(img)
  cropImg(img);
}

// Reset previous error messages
// productNameInput.classList.remove("is-invalid");
// productCategorySelect.classList.remove("is-invalid");
// descriptionInput.classList.remove("is-invalid");
// mrpInput.classList.remove("is-invalid");
// priceInput.classList.remove("is-invalid");
// stockInput.classList.remove("is-invalid");
// imagesInput.classList.remove("is-invalid");

// productForm.addEventListener("submit", function (event) {
//   let isValid = true;

  // Perform validation for each field
  // if (productNameInput.value.trim() === "") {
  //   isValid = false;
  //   productNameInput.classList.add("is-invalid");
  // }

  // if (productCategorySelect.value === '1') {
  //     isValid = false;
  //     productCategorySelect.classList.add('is-invalid');
  // }


  

  // if (descriptionInput.value.trim() === "") {
  //   isValid = false;
  //   descriptionInput.classList.add("is-invalid");
  // }

  // if (isNaN(mrpInput.value) || parseFloat(mrpInput.value) <= 0) {
  //   isValid = false;
  //   mrpInput.classList.add("is-invalid");
  // }

  // if (isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) {
  //   isValid = false;
  //   priceInput.classList.add("is-invalid");
  // }

  // if (isNaN(stockInput.value) || parseInt(stockInput.value) < 0) {
  //   isValid = false;
  //   stockInput.classList.add("is-invalid");
  // }

  // if (imagesInput.files.length === 0) {
  //   isValid = false;
  //   imagesInput.classList.add("is-invalid");
  // }

  // if (!isValid) {
  //   event.preventDefault(); // Prevent form submission if validation fails
  // }
// });



function validateOfferName(value){

offerNameRegExpPattern=/^[A-Z][A-Za-z0-9\s]{5,19}$/


return offerNameRegExpPattern.test(value)

}


function validateDescription(value) {
// Define the regular expression pattern for descriptions
const descriptionRegExpPattern = /^(?![0-9])[A-Za-z0-9\s.,!?'"()\-]{3,100}$/


// Test the value against the regular expression
return descriptionRegExpPattern.test(value);
}

