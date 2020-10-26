var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);
var request = new XMLHttpRequest();
var panier = localStorage;
var size = Object.keys(panier).length;
var tabPanier = [];
var clear = document.getElementById("clear");
var urlApi = "http://localhost:3000/api/teddies";
tabPanier.length = size;


function GestionPanier() {
  //Verification parametre URl
  if(params.has('id')) {
    var id = params.get('id');
    if (size == 0) {
      panier.setItem('Ours', id);
    } else {
      var nb = size;
      panier.setItem('Ours'+ nb,id)
    }
    params.delete('id');
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
}





function affichagePanier (allteddies) {
  var json = JSON.parse(allteddies);
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



function getallteddies(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function() {
      if (xhr.status != 200) { // analyze HTTP status of the response
        reject('Error'+xhr.status+':'+ xhr.statusText); // e.g. 404: Not Found
      } else { // show the result
        resolve(xhr.responseText); // response is the server
      }
    }
    xhr.onerror = function() {
      reject("Request failed");
    };
    xhr.send();
  });
}

function redirectForm(response) {
  var json = JSON.parse(response);
  var results = json;
  panier.clear();
  var price = 0;
  for(i=0;i<results.products.length;i++){
    price = price + results.products[i].price;
  }
  var confirmUrl = url.pathname.replace('panier','confirmation') +
                '?id=' + results.orderId +
                '&price=' + price;
  window.location.href = confirmUrl;
}


function postForm(url,json) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url + '/order');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status != 201) { // analyze HTTP status of the response
        reject('Error'+xhr.status+':'+ xhr.statusText); // e.g. 404: Not Found
      } else { // show the result
        resolve(xhr.responseText); // response is the server
      }
    }
    xhr.onerror = function() {
      reject("Request failed");
    };
    xhr.send(json);
  });
}




var teddies = getallteddies(urlApi);
    teddies.then((value) => {
      GestionPanier();
      affichagePanier(value);

    }).catch((error) => {
      console.log(error);
    })

//Bouton vider le panier
  clear.onclick = function() {
    panier.clear();
  }

//test Formulaire
function ValidateEmail(email)
{
  var mailformat =  RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
  if(mailformat.test(email)){
    return true;
  } else {
    return false;
  }
}
function validateInput(input,nbCharactere) {
  var  regex = RegExp('^[a-zA-Z]+$');
  if(regex.test(input)){
    if(input.length > nbCharactere){
      return true;
    }else {
      return false;
    }
  } else {
    return false;
  }
}
function validatePanier(panier) {
  return new Promise((resolve, reject) => {
    if(panier[0] != null) {
      resolve("Le Panier n'est pas vide");
    }else {
      reject("Le Panier est vide")
    }
  });
}
//Formulaire event
(function() {
  window.addEventListener("load", function() {
    var form = document.getElementById("form")

    form.addEventListener("submit", function(event) {
      event.preventDefault()
      var prenom = form.elements.inputPrenom.value.trim();
      var nom = form.elements.inputNom.value.trim();
      var address = form.elements.inputAddress.value.trim();
      var email = form.elements.inputAddressElectronique.value.trim();
      var ville = form.elements.inputVille.value.trim();


      if (form.checkValidity() == false) {
        form.classList.add("was-validated");
        return;
      }
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
        console.log(testjson);

        var verifPanier = validatePanier(tabPanier);
        verifPanier.then((value) => {
          var result = postForm(urlApi,testjson);
          result.then((value) => {
              redirectForm(value);
          }).catch((error) => {
            console.log(error);
          })
        }).catch((error) => {
          var panier_vide = '<div class="col-md-12">' +
                        '<div class="alert alert-danger text-center" role="alert">'+
                          error +
                        '</div>'+
                      '</div>';
          document.getElementById("ListeArcticlePanier").innerHTML = panier_vide;
        })
      form.classList.add("was-validated")
    }, false)
  }, false)
}())
