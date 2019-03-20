
var socket=io();

{  
    var wel = document.getElementById("abso");
    var inp=document.getElementById("body");
    var op = 1;
    var op1=0;
    var id = setInterval(frame, 10);
    var inp1 = document.createElement("INPUT");
    inp1.setAttribute("type", "text");
    inp1.setAttribute("name", "email");
    inp1.setAttribute("placeholder", "username");
    inp1.setAttribute("id", "username");
    var inp2 = document.createElement("INPUT");
    inp2.setAttribute("type", "password");
    inp2.setAttribute("name", "pass");
    inp2.setAttribute("placeholder", "password");
    inp2.setAttribute("id", "password");
    var inp3 = document.createElement("br");
    var inp4 = document.createElement("INPUT");
    inp4.setAttribute("type", "submit");
    inp4.setAttribute("name", "signin");
    inp4.setAttribute("id", "signin");
    inp4.value="Singin";
    var inp5 = document.createElement("INPUT");
    inp5.setAttribute("type", "submit");
    inp5.setAttribute("name", "login");
    inp5.setAttribute("id", "login");
    inp5.value="Login";
    inp1.classList.add("inp");
    inp2.classList.add("inp");
    inp.appendChild(inp1);
    inp.appendChild(inp2);
    inp.appendChild(inp3);
    inp.appendChild(inp4);
    inp.appendChild(inp5);
    function frame() {
        if (op <= 0) {
            clearInterval(id);
            inp1.style.opacity=1;
            inp2.style.opacity=1;
            inp4.style.opacity=1;
            inp5.style.opacity=1;
        }
        else {
            op-=.02; 
            wel.style.opacity= op;  
        }
    }
}

$(document).ready(function()
{
    $("#signin").click(function()
    {
        var email=$("#username").val();
        var passw=$("#password").val();
        $.post("http://localhost:8080/signin",{email: email,password: passw},function(data){
            if(data=="succ-signup")
            {
                window.location.href="/";
            }
        });
    });
});

$(document).ready(function()
{
    $("#login").click(function()
    {
        var email=$("#username").val();
        var passw=$("#password").val();
        $.post("http://localhost:8080/login",{email: email,password: passw},function(data){
            if(data=="accepted")
            {
                window.location.href="/homepage";   
            }
        });
    });
});

socket.on("invalid-email-pass",function(){
    window.alert("invalid email or password");
});

socket.on("please-check-your-connection",function(){
    windoe.alert("please check your connection");
});