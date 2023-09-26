const usernameElement=document.getElementById('username')
const userNameError=document.getElementById('usernameErr')
const emailElement=document.getElementById('signupEmail')
const emailErr=document.getElementById('emailErr')
const passwordInput = document.getElementById("signupPassword")
const rePasswordInput = document.getElementById("signupRePassword")
const passwordError = document.getElementById("passwordErr")


//username regExp
const usernamePattern=/^[a-zA-Z]{3,}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;



//function to validate username
function validateuserName(username) {
    return usernamePattern.test(username)
}

//function to validate email
function validateEmail(email) {
    return emailPattern.test(email)
}

  // Function to validate the password
  function validatePassword(password) {
    return passwordPattern.test(password)
  }

const handleSignUpSubmit=(event)=>{
    
    //if username input is blank
    if(usernameElement.value===""){
    document.getElementById('usernameErr').textContent="Username Should not be blank"
    event.preventDefault()
    }

    //if username doesn't match regExp
    if(!validateuserName(usernameElement.value)){
        console.log('hlekj')
        document.getElementById('usernameErr').textContent='Username is invalid'
        event.preventDefault()
    }

    //if email is empty
    if(emailElement.value===""){
        document.getElementById('emailErr').textContent="Email Should not be blank"
       
        }

    //if email doesn't match regExp
    if(!validateEmail(emailElement.value)){
        document.getElementById('emailErr').textContent='Email is invalid'
        event.preventDefault()
    }

    if (passwordInput.value === "") {
        passwordError.textContent = "Password cannot be blank";
        event.preventDefault();
        return;
      }
      if (rePasswordInput.value === "") {
        passwordError.textContent = "Password cannot be blank";
        event.preventDefault();
        return;
      }


      if(passwordInput.value.trim()!=rePasswordInput.value.trim()){
        console.log('bothlsdkjf')
        passwordError.textContent = "Both Passwords should be equal";
        event.preventDefault();
        return 
      }

      if (validatePassword(passwordInput.value)) {
        // Email is valid
        passwordError.textContent = ""; // Clear the error message
        
        // Perform other form submission actions
      } else {
        // Email is invalid
        passwordError.textContent = "Invalid password!";
        event.preventDefault();
        return;
        // Prevent the form from being submitted
      }
    

    
  
    

}

const signupForm=document.getElementById('signupForm')


signupForm.addEventListener('submit',handleSignUpSubmit)




