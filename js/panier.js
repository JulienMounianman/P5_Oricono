var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);
var request = new XMLHttpRequest();
var panier = localStorage;
var size = Object.keys(panier).length;
var tabPanier = [];
var clear = document.getElementById("clear");
tabPanier.length = size;

if(params.has('id')) {
  var id = params.get('id');
  console.log(size);
  if (size == 0) {
    panier.setItem('Ours', id);
  } else {
    var nb = size;
    panier.setItem('Ours'+ nb,id)
  }
}
for (var i= 0; i <= size; i++) {
  if (i == 0) {
    tabPanier[i] = panier.getItem('Ours');
  }else{
    tabPanier[i] = panier.getItem('Ours'+ i);
  }
}

clear.onclick = function() {
  panier.clear();
}

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      var json = JSON.parse(request.responseText);
      var results = json;
      var teddies = [];
      var prixtotal = 0;
      teddies.length = size;
      var test = '';
      for (var x in results) {
        for (var i= 0; i <= tabPanier.length; i++) {
          if (results[x]._id == tabPanier[i]) {
            var color = "secondary";
            switch (results[x]._id) {
              case '5be9c8541c9d440000665243':
              color = "secondary";
              break;
              case '5beaa8bf1c9d440000a57d94':
              color = "danger";
              break;
              case '5beaaa8f1c9d440000a57d95':
              color = "info";
              break;
              case '5beaabe91c9d440000a57d96':
              color = "success";
              break;
              case '5beaacd41c9d440000a57d97':
              color = "dark";
            }
          var test =
          '<div class="col-sm-3">'+
            '<div class="card text-white bg-'+color+' mb-3" style="max-width: 18rem;">'+
              '<div class="card-header">'+ results[x].name  +'</div>'+
              '<div class="card-body">'+
                '<h5 class="card-title">'+ results[x].price  +'</h5>'+
                '<p class="card-text"></p>'+
              '</div>'+
            '</div>'+
          '</div>';
          teddies[i] = test

          prixtotal = prixtotal + results[x].price;
          }
        }
      }
    allArticlePanier = teddies.join("");
    var afficherPrixTotal = "Prix total : " + prixtotal;
    document.getElementById("ListeArcticlePanier").innerHTML = allArticlePanier;
    document.getElementById("prixtotal").innerHTML = afficherPrixTotal;
    }
  }
  request.open("GET", "http://localhost:3000/api/teddies");
  request.send();
