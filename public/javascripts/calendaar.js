var getDaysInMonth = function(month,year) {
    return new Date(year, month, 0).getDate();
};
var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
var d = new Date();

/*top month-year bar*/
var d_el=document.getElementById("current_m");
var dat_month=d.getMonth();
var dat_year=d.getYear()+1900;
var dat_year_str=dat_year.toString();
var D=MONTHS[dat_month];
d_el.innerHTML=D+" "+dat_year_str;

function left(){
    if(dat_month>0){
        dat_month=dat_month-1;
        D=MONTHS[dat_month];
        d_el.innerHTML=D+" "+dat_year;
        //showCalend(dat_month,dat_year);
    }else if(dat_month==0){
        dat_year=dat_year-1;
        dat_month=11;
        D=MONTHS[dat_month];
        d_el.innerHTML=D+" "+dat_year;
        //showCalend(dat_month,dat_year);
    }
    get_dates();
}
function right(){
    if(dat_month<11){
        dat_month=dat_month+1;
        D=MONTHS[dat_month];
        d_el.innerHTML=D+" 2020";
        //showCalend(dat_month,dat_year);
    }else if(dat_month==11){
        dat_year=dat_year+1;
        dat_month=0;
        D=MONTHS[dat_month];
        d_el.innerHTML=D+" "+dat_year;
        //showCalend(dat_month,dat_year);
    }
    get_dates();
}
//add or remove date
function addDate(event){
    if(event.target.parentNode.style.backgroundColor!="silver"){
        event.target.parentNode.style.backgroundColor="silver";
        var a=event.target.parentNode.firstChild.innerText;
        var MON=dat_month+1;
        if(MON<10){
            MON="0"+MON.toString();
        }
        if(parseInt(a,10)<10){
            a="0"+a.toString();
        }
        var date_str=dat_year_str+"-"+MON+"-"+a;
        var xhttp = new XMLHttpRequest();
        var add_date = {new_date:date_str};
        xhttp.open("POST", "users/calender/add", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(add_date));
    }
}
function removeDate(event){
    if(event.target.parentNode.style.backgroundColor=="silver"){
        event.target.parentNode.style.backgroundColor="#DDDBCB";
        var xhttp = new XMLHttpRequest();
        var a=event.target.parentNode.firstChild.innerText;
        var MON=dat_month+1;
        if(MON<10){
            MON="0"+MON.toString();
        }
        if(parseInt(a,10)<10){
            a="0"+a.toString();
        }
        var date_str=dat_year_str+"-"+MON.toString()+"-"+a;
        var remove_date = {old_date:date_str};
        xhttp.open("POST", "users/calender/remove", true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSON.stringify(remove_date));
    }
}

/*get dates and load them*/
var arr = [];
var counter;

function get_dates(){
var xhttp3 = new XMLHttpRequest();
xhttp3.onreadystatechange = function(){
    if(this.readyState==4&this.status==200){
        arr = JSON.parse(this.responseText);
        counter = Object.keys(arr).length;
        showCalend(dat_month,dat_year);
    }
};
xhttp3.open("GET", "/users/calender/retrieve", true);
xhttp3.send();
}
get_dates();
//get the days of the month from the list of unavaliable dates
function loadDates(year,month,day){

    //convert dates into arrays of [year,month,day]
    for(var h=0;h<counter;h++){
        var Adate = arr[h].off_date.split('-');
        //return true if the date is unavaliable
        var a=parseInt(Adate[1],10);
        var b=parseInt(Adate[2],10);
        if(Adate[0]==year.toString() && a==month.toString() && b==day.toString()){
            return true;
        }
    }
    return false;
}

//show calender

function showCalend(mont,year) {
    let first = (new Date(year, mont)).getDay();
    tbl = document.getElementById("calend_days"); // body of the calendar
    // clearing all previous cells
    tbl.innerHTML = "";
    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");
        //creating cells with data
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < first) {
                let cell = document.createElement("td");
                var cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > getDaysInMonth(mont+1, year)) {
                break;
            }
            else {

                let cell = document.createElement("td");
                var buttons='<button type="button" class="but" onclick="addDate(event)" data-toggle="tooltip" data-placement="top" title="Set date as unavaliable">+</button>\
                <button onclick="removeDate(event)" class="but" type="button" data-toggle="tooltip" data-placement="top" title="Set date as avaliable">-</button>';
                cell.innerHTML='<p>'+date.toString()+'</p>'+buttons;
                cell.classList.add("bg2");
                cell.setAttribute("value", date);
                if (loadDates(year,mont+1,date)) {
                    cell.style.backgroundColor='silver';
                }
                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row); // appending each row into calendar body.
    }
}
var cell_list = document.getElementsByClassName('bg2');
for(var w=0;w<cell_list.length;w++){
    var v = cell_list[w].getAttribute('value');
    if(loadDates(dat_year,dat_month,v)){
        cell_list[w].style.backgroundColor='silver';
    }
}
//create a function that returns true if the date is in the array of unavaliability
/*document.getElementsByClassName('bg2')[0].getAttribute('value');
document.getElementsByClassName('bg2')[0].style.backgroundColor='silver';*/

