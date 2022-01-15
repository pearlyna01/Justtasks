var vueinst = new Vue({
    el:"#content",
    data:{
        isManager:true,
        newT:false,
        newtask:{},
        test:"test",
        task_index:0,
        task_list2:[],
        completed:[], //this is the selected tasks
        uncompleted:[],
        showDetails:false,
        showT:true,
        team_mem:[],
        assign_check:false,
        assign_list:[],
        assign_person:'',
        date_list:[]
    },methods:{
        showDetail:function(event){
            var a = event.target.querySelector('a');
            a.style.display='block';
            task_index=event.target.getAttribute("value");
            //task_current=task_list2[task_index];
        },createTask:function(){
            if(this.newT==false){
                this.newT=true;
                var b=document.getElementById('saveTask');
                b.disabled=false;
            }else{
                this.newT=false;
                var d=document.getElementById('saveTask');
                d.disabled=true;
            }
        },saveNewTask:function(){
            var Tname=document.getElementById("tname").value;
            var Tdate_day=document.getElementById("days").value;
            var Tdate_mon=document.getElementById("months").value;
            var Tdate_yrs=document.getElementById("years").value;
            var Tdate = Tdate_yrs.toString()+"-"+Tdate_mon.toString()+"-"+Tdate_day.toString();
            var prior=document.getElementById("priority").value;
            var xhttp = new XMLHttpRequest();
            var newTask = {task_name:Tname,priority:prior,d_date:Tdate};
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status >= 400){
                    alert('Unable to save task.');
                }else if(this.readyState==4 && this.status == 200){
                    vueinst.get_tasks();
                }
            };
            xhttp.open("POST", "/users/task/create", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(newTask));
            this.newT=false;
            var b=document.getElementById('saveTask');
            b.disabled=true;
            document.getElementById('test').reset();

            //vueinst.get_tasks();
        },list_mem:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status == 200){
                    vueinst.team_mem = JSON.parse(this.responseText);
                }
            };
            xhttp.open("GET","/users/teamMembers",true);
            xhttp.send();
        },reset:function(){
            this.completed=[];
        },assignTask:function(){
            //var date_list2=[];

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4 && this.status >= 400){
                    alert('Unable to assign task(s).Please check if the person is avaliable on that day');
                }else if(this.readyState==4 && this.status == 200){
                    vueinst.get_tasks();
                }
            };
            xhttp.open("POST", "/users/task/assign", true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({person:vueinst.assign_person,list:vueinst.assign_list,list2:vueinst.date_list}));
            //send notification
            //var xhttp2 = new XMLHttpRequest();
            //xhttp2.open("POST", "/users/sendNotifi", true);
            //xhttp2.setRequestHeader("Content-type", "application/json");
            //xhttp2.send(JSON.stringify({message:'New tasks has been assigned to you by ',assignee:vueinst.assign_person}));
            vueinst.assign_check=false;
            vueinst.assign_list=[];
            //vueinst.get_tasks();
        },completeTask:function(){
            var xhttp5 = new XMLHttpRequest();

            xhttp5.open("POST", "/users/task/complete", true);
            xhttp5.setRequestHeader("Content-type", "application/json");
            xhttp5.send(JSON.stringify({task_list:vueinst.completed,task_list2:vueinst.uncompleted}));
        },get_tasks:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4&this.status==200){
                    vueinst.task_list2 = JSON.parse(this.responseText);
                    for(var t=0;t<Object.keys(vueinst.task_list2).length;t++){
                        vueinst.task_list2[t].due_date=vueinst.task_list2[t].due_date.substring(0, 10);
                        if(vueinst.task_list2[t].complete==1){
                            vueinst.completed.push(vueinst.task_list2[t].task_id);
                        }
                    }
                }
            };
            xhttp.open("GET", "/users/task/retrieve.json", true);
            xhttp.send();
        },/*toggle details*/
        detail_look:function(event) { //this is to close #detail
            var e=event.target.parentNode;
            e.style.display="none";
            this.showDetails=false;
        },detail_look2:function (event){

            //this.task_index=event.target.getAttribute("value");
            this.showDetails=true;

            vueinst3.itemTask=this.task_list2[this.task_index];
            vueinst2.itemTask=this.task_list2[this.task_index];
            if(this.isManager==true){
                var a=document.getElementsByClassName("detail")[1];
                a.style.display="block";
            }else{
                var Z=document.getElementsByClassName("detail")[0];
                Z.style.display="block";
            }
            /*document.getElementById("t_name").innerText=this.task_list2[this.task_index].task_name;
            document.getElementById("t_descr").innerText=this.task_list2[this.task_index]["description"];
            document.getElementById("t_date").innerText=this.task_list2[this.task_index].due_date;
            document.getElementById("t_prior").innerText=this.task_list2[this.task_index].priority;
            */
        },itsKaren:function(){
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function(){
                if(this.readyState==4&this.status==200){
                    vueinst.isManager=parseInt(this.responseText,10);
                }
            };
            xhttp.open("GET", "/users/isManager", true);
            xhttp.send();
        },toggle:function(){
            if(this.assign_check==false){
                this.assign_check=true;
            }else{
                this.assign_check=false;
            }
        }

    },computed:{

    },watch:{
        completed:function(){
            this.uncompleted = [];
            for(var t=0;t<Object.keys(this.task_list2).length;t++){
                if(!this.completed.includes(this.task_list2[t].task_id)){
                    this.uncompleted.push(vueinst.task_list2[t].task_id);
                }
            }
        },assign_list:function(){
            this.date_list = [];
            for(var t=0;t<Object.keys(this.task_list2).length;t++){
                if(this.assign_list.includes(this.task_list2[t].task_id)){
                    this.date_list.push(vueinst.task_list2[t].due_date);
                }
            }
        }
    }
});
vueinst.list_mem();
vueinst.get_tasks();
vueinst.itsKaren();
//var something = vueinst.task_index;
var vueinst2 = new Vue({
    el:"#detail1",
    data:{
        isManager2:vueinst.isManager,
        itemTask:[],
        showDetail2:vueinst.showDetails
    },methods:{
        change:function(){

        }
    }

});
var vueinst3 = new Vue({
    el:"#detail2",
    data:{
        //isManager3:vueinst.isManager,
        itemTask:[],
        showDetail2:vueinst.showDetails
    },methods:{
        saveEdit:function(){
            var xhttp6 = new XMLHttpRequest();
            xhttp6.onreadystatechange = function(){
                if(this.readyState==4&this.status==200){
                    alert('task saved!');
                }else if(this.readyState==4&this.status>=400){
                    alert('task not saved!');
                }
            };
            xhttp6.open("POST", "/users/task/edit", true);
            xhttp6.setRequestHeader("Content-type", "application/json");
            xhttp6.send(JSON.stringify(vueinst3.itemTask));
        }
    }
});
//close user_details
function closeN2(){
    document.getElementsByClassName("notifi")[1].style.display="none";
}
function openN2(){
    document.getElementsByClassName("notifi")[1].style.display="block";
}