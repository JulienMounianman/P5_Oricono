var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);
var request = new XMLHttpRequest();

//Verification parametre URL ET Requetes get
if(params.has('id')) {
  var id = params.get('id');
  request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var panierUrl = adresseActuelle.replace('produit','panier');
        var json = JSON.parse(request.responseText);
        var results = json;
        var colors = [];
        colors.length = results.colors.length;
        for (var i= 0; i < colors.length; i++) {
          if(i == 0){
            colors[i] = '<button type="button" class="list-group-item list-group-item-action active" id="color'+i+'">'+results.colors[i]+'</button>';
          }else {
            colors[i] = '<button type="button" class="list-group-item list-group-item-action" id="color'+i+'">'+results.colors[i]+'</button>';
          }
        }
        colors_results = colors.join("");
        var test =
          '<div class="card text-center">'+
            '<div class="card-header">' +
              '<h5 class="card-title">'+ results.name +'</h5>'+
            '</div>' +
            '<img src="'+ results.imageUrl +'" class="card-img-top" alt="image'+ results.name +'">'+
            '<div class="card-body">'+
              '<p class="card-text">'+ results.description +'<span class="badge badge-pill badge-info">'+ results.price +'</span></p>'+
              '<a href="'+ panierUrl +'" class="btn btn-primary">Ajouter au panier</a>'+
            '</div>'+
            '<div class="card-footer text-muted">'+
              '<div class="list-group" id="colors">'+
              '</div>'+
            '</div>'+
          '</div>';
          console.log(results);
        var title = 'Oricono | '+ results.name;

        document.getElementById("teddy").innerHTML = test;
        document.getElementById("colors").innerHTML = colors_results;
        document.getElementById("title").innerHTML = title;

        var btnContainer = document.getElementById("colors");
        var btns = btnContainer.getElementsByClassName("list-group-item");

        for (var i = 0; i < btns.length; i++) {
          btns[i].addEventListener("click", function() {
          var current = btnContainer.getElementsByClassName("active");
          current[0].classList.remove("active")
          this.classList.add("active") ;
          });
        }
      }
    }
  request.open("GET", "http://localhost:3000/api/teddies/"+ id);
  request.send();
}
