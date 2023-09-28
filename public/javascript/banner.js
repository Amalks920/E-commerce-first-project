
    const bannerForm = document.getElementById('bannerForm');
    const bannerNameInput = document.getElementById('bannername');
    const imagesInput = document.querySelector('input[type="file"]');
    const submitButton = document.querySelector('button[type="submit"]');
    const defaultCat=document.querySelector('#default-cat');
    const prodOfferSelect=document.querySelector('#prod-offer')


    bannerForm.addEventListener('submit', function (event) {
        let isValid = true;
        const selectedOption = prodOfferSelect.options[prodOfferSelect.selectedIndex];
        console.log(selectedOption.value)

        // Reset previous error messages
        bannerNameInput.classList.remove('is-invalid');
        imagesInput.classList.remove('is-invalid');
        prodOfferSelect.classList.remove('is-invalid');


        // Perform validation for each field
        if (bannerNameInput.value.trim() === '' || !validateBannerName(bannerNameInput.value.trim())) {
            isValid = false;
            bannerNameInput.classList.add('is-invalid');
        }

        if (imagesInput.files.length === 0) {
            isValid = false;
            imagesInput.classList.add('is-invalid');
        }

        if(selectedOption.value==1){
            isValid = false;
            prodOfferSelect.classList.add('is-invalid');
        }

        if(!validateFiles(imagesInput)){
            
    // if (1 === 0) {
      isValid = false;
      imagesInput.classList.add("is-invalid");
    }

        if (!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });


function validateBannerName(value){

offerNameRegExpPattern=/^[A-Z][A-Za-z0-9\s]{5,19}$/


return offerNameRegExpPattern.test(value)

}


function validateFiles(input) {
  const files = input.files; // Use input.files to get the FileList from the file input

  for (let i = 0; i < files.length; i++) {
    const file = files[i]; // Access the current file in the loop
    const fileType = file.type;

    // Check if the file type is an image (you can add more image types as needed)
    if (fileType.startsWith("image/")) {
      // File is an image
      console.log(`File ${file.name} is an image.`);
    } else {
      // File is not an image
      console.log(`File ${file.name} is not an image.`);
      return false; // Return false if any file is not an image
    }
  }

  // If the loop completes without finding a non-image file, return true
  return true;
}
