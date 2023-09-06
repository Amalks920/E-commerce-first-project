
function cropImg(crpImg){

// const crpImg=document.getElementById("crpImg")


const cropper=new Cropper(crpImg,{
    aspectRatio:0,
    viewMode:0,
    minContainerWidth:400,
    minContainerHeight:200
})

const cropBtn=document.getElementById('crpBtn')

cropBtn.addEventListener('click',function(){
    const newImage=cropper.getCroppedCanvas().toDataURL('image/png')
    console.log(newImage)
    crpImg.src=newImage
    cropper.destroy()
})

cropper.destroy


}