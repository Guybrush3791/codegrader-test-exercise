// get data and show it
var x = "https://jsonplaceholder.typicode.com/todos";

fetch(x)
  .then(function(r) {
    return r.json();
  })
  .then(function(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].completed == false) {
        arr.push(data[i].title);
      }
    }
    
    var html = "";
    for (var j = 0; j < 5; j++) {
      html = html + "<p>" + arr[j] + "</p>";
    }
    
    document.getElementById("output").innerHTML = html;
  });
