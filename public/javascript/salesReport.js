const toDate=document.querySelector('#to');
const fromDate=document.querySelector('#from');
const form=document.querySelector('#form')
const dateFilterBtn=document.querySelector('#date-filter')


let to,from;

toDate.addEventListener('input',function () {
 to=toDate.value

    

  
})

fromDate.addEventListener('input',function () {
from=fromDate.value
console.log(from)
})


form.addEventListener('submit', function (event) {



    if(to && from){

        let filterParameters={
            to:to,
            from:from
        }

   // Serialize the filterParameters object into JSON
  const filterParametersJSON = JSON.stringify(filterParameters);

  // Encode the JSON string
  const encodedFilterParameters = encodeURIComponent(filterParametersJSON);

  // Get the current URL
  const currentUrl = window.location.href;

  // Construct the new URL with the query parameter
  const urlWithParameter = `${currentUrl}?filter=${encodedFilterParameters}`;

  // Redirect the user to the new URL
  window.location.href = urlWithParameter;

    }else{
     event.preventDefault()
    }


})



// dateFilterBtn.addEventListener('click',function () {
//     fetch(`/admin/sales-report/?to=${toDate.value}?from=${fromDate.value}`,
//     {
//         method:'POST'
//     }
//     )
//     .then(response=>console.log(response.url))
// })

