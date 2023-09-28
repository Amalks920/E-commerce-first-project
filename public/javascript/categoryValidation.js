

    const imagesInput = document.querySelector('input[type="file"]');
    const category=document.getElementById('category');
    const description=document.getElementById('description');
    const categoryForm=document.getElementById('cat-form')
    const err=document.getElementById('err')


    categoryForm.addEventListener('submit',function(event){
    let isValid=true;
      // Reset previous error messages
      imagesInput.classList.remove('is-invalid');
      category.classList.remove('is-invalid');
      description.classList.remove('is-invalid');

            // Perform validation for each field
      if (category.value.trim() === '' || !validateCatName(category.value.trim())) {
        isValid = false;
        category.classList.add('is-invalid');
      }


      if (description.value.trim() === '' || !validateDescription(description.value.trim())) {
          isValid = false;
          description.classList.add('is-invalid');
      }

      if (!validateFiles(imagesInput)) {
          isValid = false;
          imagesInput.classList.add('is-invalid');
      }
      
      if (imagesInput.files.length === 0) {
          isValid = false;
          imagesInput.classList.add('is-invalid');
      }

      if (!isValid) {
          event.preventDefault(); // Prevent form submission if validation fails
      }
      
  })


  const inputElements=document.querySelectorAll('.input');

  inputElements.forEach((element,index)=>{
    element.addEventListener('input',function () {
    err.style.display="none";

    })
  })



  function validateFiles(input) {
    const files = input.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(file)
        const fileType = file.type;

        // Check if the file type is an image (you can add more image types as needed)
        if (fileType.startsWith('image/')) {
            // File is an image
            console.log(`File ${file.name} is an image.`);
            return true
        } else {
            // File is not an image
            console.log(`File ${file.name} is not an image.`);
            return false
        }
    }
}



function validateCatName(value){

    categoryRegExpPattern=/^[A-Z][A-Za-z\s0-9]{1,30}$/

    return categoryRegExpPattern.test(value)

}

function validateDescription(value) {
  // Define the regular expression pattern for descriptions
  const descriptionRegExpPattern = /^[A-Za-z0-9\s.,!?'"()\-]{3,100}$/;

  // Test the value against the regular expression
  return descriptionRegExpPattern.test(value);
}


