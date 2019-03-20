
var socket=io();

/*upload input button*/
$(document).ready(function()
{
    $("#logout").click(function()
    {
        $.post("http://localhost:8080/logout",function(data){
            if(data=="succ-logout")
            {
                window.location.href="/";
            }
        });
    });
});

$(document).ready(function()
{
    $("#share-button").click(function()
    {
        var filename=$("#shared-file").val();
        $.post("http://localhost:8080/file-name-share",{filename :filename},function(data){
            if(data=="succ-share")
            {
                $("#shared-file").val("");
            }
        });
    });
});

/*search input button*/
$(document).ready(function()
{
    $("#search-button").click(function()
    {
        console.log("hifd");
        var filename=$("#search").val();
        $.post("http://localhost:8080/search-file",{filename :filename},function(success){
           if(success=="succ-search")
            {
                $("#search").val("");   
            }
        });
    });
});

// $(document).ready(function()
// {
//     // var flag=1;
//     // console.log("gun");
//     // for(var i=0;i<5;i++)
//     // {
//         console.log("hii");
//         $("#reqfriend0").click(function()
//         {
//             console.log("hii");
//             //flag=0;
//             var filename=$("#req_friend0").text();
//             console.log(filename);
//             $.post("http://localhost:8080/request",{filename :filename},function(success){
//             if(success=="succ-request")
//                 {
//                     $(".req_friend").remove();   
//                 }
//             });
//         });
//         // if(flag==0)
//         // {
//         //     console.log(i);
//         //     break;
//         // }
//     // }
//  });

socket.on("error-sharing",function(){
    window.alert("error-sharing");
});

socket.on("error-searching",function(){
    window.alert("error-seacrhing");
});

io().on("first-five",function(data){
    var body=document.getElementById("homepage");
    var top=30;
    var len=data.arr.length;
    var inp=document.createElement("h1");
    inp.setAttribute("id","heading");
    inp.style.top=""+20+"%";
    inp.style.left=""+3+"%";
    inp.innerHTML="people online with file";
    body.appendChild(inp);

    $("#search").val("");
    $(".reqfriend").remove();
    if(len<=5)
    {
        for(var i=0;i<len;i++)
        {
            var inp=document.createElement("button");
            inp.setAttribute("class","reqfriend");
            inp.setAttribute("id","reqfriend"+i);
            inp.style.top=""+top+"%";
            inp.style.left=""+3+"%";
            inp.innerText=data.arr[i].provider;
            body.appendChild(inp);
            top+=10;

        }
    }
    else
    {
        for(var i=0;i<5;i++)
        {
            var inp=document.createElement("button");
            inp.setAttribute("class","reqfriend");
            inp.setAttribute("id","reqfriend"+i);
            inp.style.top=""+top+"%";
            inp.style.left=""+3+"%";
            inp.innerText=data.arr[i].provider;
            body.appendChild(inp);
            top+=10;
        }   
    }
    $(document).ready(function()
{
    // var flag=1;
    // console.log("gun");
    // for(var i=0;i<5;i++)
    // {
        console.log("hii");
        $("#reqfriend0").click(function()
        {
            console.log("hiilawdlasd");
            //flag=0;
            var filename=$("#req_friend0").text();
            console.log(filename);
            $.post("http://localhost:8080/request",{filename :filename},function(success){
            if(success=="succ-request")
                {
                    $(".req_friend").remove();   
                }
            });
        });
        // if(flag==0)
        // {
        //     console.log(i);
        //     break;
        // }
    // }
 });
});


