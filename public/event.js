let button = document.getElementsByClassName("clickme")
document.getElementById("date").value= new Date();
//console.log(button)
button[0].addEventListener("click",function(){
  //  let data = document.getElementsByClassName("ql-editor")
    let name= document.getElementById("name");
    let date= document.getElementById("date");
    name=name.value;
    date=date.value;

    window.delta = quill.getContents();
    // console.log(delta)
    
    let bc =quill.root.innerHTML
    var person ={
      name:name,
      date:date,
      data:bc     
    }
    document.getElementById("blog-output").innerHTML=person.data;
    const options= {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        
        // body: JSON.stringify(delta)
        // body:bc.kick
        body:JSON.stringify(person)
    }

    fetch("/api",options)
    .then(()=> { console.log(bc)})
   // console.log(quill.root.innerHTML)
})

