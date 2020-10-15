var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);
var request = new XMLHttpRequest();
var panier = localStorage;
var size = Object.keys(panier).length;
var tabPanier = [];
var clear = document.getElementById("clear");
tabPanier.length = size;

//Verification parametre URl
if(params.has('id')) {
  var id = params.get('id');
  if (size == 0) {
    panier.setItem('Ours', id);
  } else {
    var nb = size;
    panier.setItem('Ours'+ nb,id)
  }
}

//Ajout des articles du panier dans un Tableau js
for (var i= 0; i <= size; i++) {
  if (i == 0) {
    tabPanier[i] = panier.getItem('Ours');
  }else{
    if(panier.getItem('Ours'+ i) != null) {
      tabPanier[i] = panier.getItem('Ours'+ i);
    }
  }
}

//Bouton vider le panier
clear.onclick = function() {
  panier.clear();
}

//Requetes get pour afficher article panier
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

//test Formulaire

(function() {
  "use strict"
  window.addEventListener("load", function() {
    var form = document.getElementById("form")
    form.addEventListener("submit", function(event) {
      if (form.checkValidity() == false) {
        event.preventDefault()
        event.stopPropagation()
      }
      var prenom = form.elements.inputPrenom.value.trim();
      var nom = form.elements.inputNom.value.trim();
      var address = form.elements.inputAddress.value.trim();
      var email = form.elements.inputAddressElectronique.value.trim();
      var ville = form.elements.inputVille.value.trim();

        var contact = new Object();
          contact.firstName = prenom;
          contact.lastName = nom;
          contact.address = address;
          contact.city = ville;
          contact.email = email;
        var products = tabPanier;

        var finalObj = new Object();
        finalObj.contact = contact;
        finalObj.products = products

        var testjson = JSON.stringify(finalObj);

        if(tabPanier[0] != null) {
          request.onreadystatechange = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
              var json = JSON.parse(request.responseText);
              var results = json;
              panier.clear();
              var price = 0;
              for(i=0;i<results.products.length;i++){
                price = price + results.products[i].price;
              }
              var confirmUrl = adresseActuelle.replace('panier','confirmation') +
                            '?id=' + results.orderId +
                            '&price=' + price;
              window.location.href = confirmUrl;
            }
          }
          request.open("POST", "http://localhost:3000/api/teddies/order");
          request.setRequestHeader("Content-Type", "application/json");
          request.send(testjson);
        }else {
          window.alert("Panier vide !");
        }
      form.classList.add("was-validated")
    }, false)
  }, false)
}())
