var vueinst = new Vue({
    el:"#login",
    data:{
        InputEmail:"",
        InputPassword:"",
        warn:false
    },methods:{
        log_in:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 2 && this.status == 204) {
                    // Login successful
                    window.location.pathname = "/main.html";
                }else if (this.readyState == 2 && this.status == 401) {
                    // Login Failed; wrong password
                    document.getElementsByClassName("warning")[0].style.display="block";
                    document.getElementsByClassName("warning")[0].innerText="Password is incorrect.";
                }else if (this.readyState == 2 && this.status == 404){
                    // Login failed; wrong email
                    document.getElementsByClassName("warning")[0].style.display="block";
                    document.getElementsByClassName("warning")[0].innerText="Email address does not exist.";
                }else if (this.readyState == 2 && this.status >= 400){
                    alert('error logging in.');
                }
            };
            var userStuff = {email:vueinst.InputEmail,password:vueinst.InputPassword};
            xhttp.open("POST", "/login", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(userStuff));
        }
    }
});
//function onSignIn(googleUser) {
//  var id_token = googleUser.getAuthResponse().id_token;
//
//}
gapi.load('auth2',function(){
    gapi.auth2.init();
});