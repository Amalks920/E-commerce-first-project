
let fileListArray=[]

function cropImg(crpImg,btn){

// const crpImg=document.getElementById("crpImg")


const cropper=new Cropper(crpImg,{
    aspectRatio:0,
    viewMode:0,
    minContainerWidth:400,
    minContainerHeight:200
})



btn.addEventListener('click',function(){
    const newImage=cropper.getCroppedCanvas().toDataURL('image/png')
  
    crpImg.src=newImage
   


    const dataURL =newImage

// Extract the base64 data from the data URL (remove the "data:image/png;base64," prefix)
const base64Data = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

// Convert the base64 data to a Uint8Array
const uint8Array = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));

// Create a Blob from the Uint8Array
const blob = new Blob([uint8Array], { type: 'image/png' }); // Adjust 'type' as needed

// Create a File from the Blob (you can specify the file name as the second parameter)
const imageFile = new File([blob], 'image.png', { type: 'image/png' }); // Adjust 'type' and 'name' as needed

console.log(imageFile)


////////////////////////////////////
// Assuming you have an existing FileList called 'fileList'
// const fileListArray = Array.from(fileList); // Convert FileList to an array

// Find the index of the file you want to remove (e.g., remove the first image)
// const fileToRemoveIndex = 0;

// if (fileToRemoveIndex >= 0 && fileToRemoveIndex < fileListArray.length) {
//   fileListArray.splice(fileToRemoveIndex, 1); // Remove the file at the specified index
// }

// Create a new File object for the new image (e.g., 'newImageFile' is the new image File)


// Add the new image file to the array
fileListArray.push(imageFile);

// Create a new FileList from the updated array

// const updatedFileList = new FileList(fileListArray);
console.log(fileListArray)
// Now, 'updatedFileList' contains the updated set of files



    cropper.destroy()
})

cropper.destroy


}