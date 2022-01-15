var vueinsa = new Vue({
    el:'#user',
    data:{
        Uname: 'User_name',
        Pro_pic : 'images/default_user.JPG'
    },methods:{
        get_userPro:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 200){
                    var obj = JSON.parse(this.responseText);
                    vueinsa.Uname = obj.username;
                    if(obj.picture!=null){
                        vueinsa.Pro_pic = obj.picture;
                    }
                }
            };
            xhttp.open("GET","/users/basicProfile.json",true);

            xhttp.send();
        }
    }
});


$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});
function load_days(){
    var day_opt = document.getElementById('days');
    for (var i = 1; i<=31; i++){
        var d = document.createElement('OPTION');
        d.value = i;
        d.innerHTML = i;
        day_opt.appendChild(d);
    }
}
/*
var months =["Jan","Feb","Mar","Apr","May","June"];
var month_opt = document.getElementById('months');
for (var j = 0; j<5; j++){
    var m = document.createElement('option');
    m.value = months[j];
    m.innerHTML = months[j];
    month_opt.appendChild(m);
}
var year_opt = document.getElementById('years');
for (var x = 2020; x<2030; x++){
    var y = document.createElement('option');
    y.value = x;
    y.innerHTML =x;
    year_opt.add(y);
}*/
/*toggle sidebar*/
function sideBar(){
    var e=document.getElementById("sidebar");
    e.classList.toggle("active");
}
//gapi.load('auth2',function(){
//    gapi.auth2.init();
//});
function logout(){
    //google
    /*var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });*/

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 2 && this.status == 200) {
            // Logout Successful, redirect to home
            window.location.pathname = "/";
        }else if (this.readyState == 2 && this.status >= 400){
            alert('logout unsuccessful.');
            window.location.pathname = "/";
        }
    };
    xhttp.open("POST", "/logout", true);
    xhttp.send();
}

/*close notification*/
function closeN(){
    document.getElementsByClassName("notifi")[0].style.display="none";
}
function openN(){
    document.getElementsByClassName("notifi")[0].style.display="block";
}

var vueObj4 = new Vue({
    el:'#note',
    data:{
        notifi_list:[]
    },methods:{
        get_note: function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 200){
                    vueObj4.notifi_list = JSON.parse(this.responseText);
                    for(var t=0;t<Object.keys(vueObj4.notifi_list).length;t++){
                        vueObj4.notifi_list[t].created=vueObj4.notifi_list[t].created.substring(0, 10);
                    }
                }
            };
            xhttp.open("GET","/users/getNotifi",true);
            xhttp.send();
        }
    }
});
vueObj4.get_note();
/*get team members*/
var vueObj5 = new Vue({
    el:'#teamM',
    data:{
        team_list:[],
        add_on:false,
        addperson:''
    },methods:{
        get_team: function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 200){
                    vueObj5.team_list = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET","/users/teamMembers",true);
            xhttp.send();
        },add_p:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 400){
                    alert('Unable to assign task(s).Please check if the person is avaliable on that day');
                }else if(this.readyState==4 && this.status == 200){

                }
            };
            xhttp.open("POST", "/users/addteam", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({person:vueinst.assign_person,list:vueinst.assign_list,list2:vueinst.date_list}));
            vueObj5.add_on=false;
        }
    },computed:{

    }
});
vueObj5.get_team();