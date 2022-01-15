var vueinst = new Vue({
    el:"#signupp",
    data:{
        userName:"",
        userEmail:"",
        userPassword:"",
        warn:false,
        Manager:'',
        clickOrNot1:false
    },methods:{
        sign_up:function(){
            //if user did not choose either manager or employee
            if(vueinst.Manager==''){
                vueinst.clickOrNot1=true;
            }
            //if user did not put the same password under "confirm password"
            if(document.getElementById("Password1").value!=document.getElementById("Password2").value){
                document.getElementsByClassName("warning")[1].style.display="block";
            }
            //if user did not check the terms and conditions
            if(document.getElementById("Check1").checked == false){
                document.getElementsByClassName("warning")[2].style.display="block";
                warn.innerText="Please tick the box after reading the terms and conditions.";
            }else{
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 2 && this.status <300) {
                            // Sign up successful
                            alert("Please login with your new account.");
                            window.location.pathname = "/";
                    }if (this.readyState == 2 && this.status == 409) {
                        // user email exists
                        document.getElementsByClassName("warning")[0].style.display="block";
                    }if (this.readyState == 2 && this.status >= 400){
                        //unable to sign up
                        document.getElementsByClassName("warning")[3].style.display="block";
                    }
                };
                var userStuff = {email:vueinst.userEmail,password:vueinst.userPassword,name:vueinst.userName,isManager:vueinst.Manager};
                xhttp.open("POST", "/signup", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify(userStuff));
            }
        }
    }
});
