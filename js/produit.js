var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);
var request = new XMLHttpRequest();

//Verification parametre URL ET Requetes get
if(params.has('id')) {
  var id = params.get('id');
  console.log(id)
  request.onreadystatechange = function() {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var panierUrl = adresseActuelle.replace('produit','panier');
        var json = JSON.parse(request.responseText);
        var results = json;
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
              results.colors
            '</div>'
          '</div>';
        var title = 'Oricono | '+ results.name;
        document.getElementById("teddy").innerHTML = test;
        document.getElementById("title").innerHTML = title;
      }
    }
  request.open("GET", "http://localhost:3000/api/teddies/"+ id);
  request.send();
}
