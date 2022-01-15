var vueObj = new Vue({
    el:'#setting',
    data:{
        profileTog:true,
        accountTog:false,
        Uname:'user_name',
        role:'user_role',
        passWord:'',
        new_passWord1:'',
        new_passWord2:'',
        saveNotice:'',saveNotice2:'',
        usermail:'userEmail',
        userpic:'images/default_user.JPG',
        passwordNotSame:false,
        wrongPass:false
    },methods:{
        switch1:function(){
            this.profileTog=false;
            this.accountTog=true;
        },switch2:function(){
            this.profileTog=true;
            this.accountTog=false;
        },saveChange:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 200){
                    vueObj.saveNotice = 'Changes saved!';
                    myVar = setTimeout(function(){
                        vueObj.saveNotice = '';
                    },2000);
                }else if(this.readyState==4 && this.status >= 400){
                    alert('Unable to update');
                }
            };
            xhttp.open("POST","/users/changeRoleName",true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({r:vueObj.role, n:vueObj.Uname,p:vueObj.userpic}));
        },saveNewPass:function(){
            if(vueObj.new_passWord1==vueObj.new_passWord2){

                var xhttp2 = new XMLHttpRequest();
                xhttp2.onreadystatechange = function(){
                    if(this.readyState==4 && this.status == 200){
                        vueObj.saveNotice2 = 'Changes saved!';
                        myVar = setTimeout(function(){
                            vueObj.saveNotice2 = '';
                        },2000);
                    }else if(this.readyState==4 && this.status == 401){
                        vueObj.wrongPass=true;
                    }else if(this.readyState==4 && this.status >= 400){
                        alert('failed to change password');
                    }
                };
                xhttp2.open("POST","/users/changePass",true);
                xhttp2.setRequestHeader("Content-type", "application/json");
                xhttp2.send(JSON.stringify({newP:vueObj.new_passWord1,oldP:vueObj.passWord}));

            }else if(vueObj.new_passWord1!=vueObj.new_passWord2){
                vueObj.passwordNotSame=true;
            }
        }
    },computed:{

    }
});
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
    if(this.readyState==4 && this.status == 200){
        var obj = JSON.parse(this.responseText);
        vueObj.Uname=obj.n;
        vueObj.role=obj.r;
        if(obj.pic!=null){
            vueObj.userpic = obj.pic;
        }
        vueObj.usermail=obj.e;
    }
};
xhttp.open("GET","/users/getRoleName",true);
xhttp.send();
