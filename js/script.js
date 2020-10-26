var request = new XMLHttpRequest();
var adresseActuelle = window.location.href;
var url = new URL('produit.html',adresseActuelle);
var urlApi = "http://localhost:3000/api/teddies";


/**
 * Fait un appel get sur une api
 *
 * @param {string} url une chaine de caracteres ezpresentant l'url de l'api.
*/
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

/**
 * Gère l'affichage de tous les ours en peluche sur ma page html
 *
 * @param {string} url une chaine de caracteres representant la reponse de l'api.
*/
function affichageAllTeddies (allteddies) {
  var json = JSON.parse(allteddies);
  var results = json;
  var teddies = [];
  teddies.length = 4;
  for (var x in results) {
    var urlproduit = url + '?id=' + results[x]._id
      var test =
      '<div class="col-md-4">' +
        '<div class="card" style="width: 18rem;">'+
          '<img src="'+ results[x].imageUrl +'" class="card-img-top" width="320" height="210" alt="image'+ results[x].name +'">'+
          '<div class="card-body">'+
            '<h5 class="card-title">'+ results[x].name +'</h5>'+
            '<p class="card-text">'+ results[x].description +'<span class="badge badge-pill badge-info">'+ results[x].price +'</span></p>'+
            '<a href="'+ urlproduit +'" class="btn btn-primary">Plus d'+ "'"+ 'infos</a>'+
            '</div>'+
        '</div>' +
      '</div>';
         teddies[x] = test;
  }
  var allteddybear = teddies.join("");
  document.getElementById("teddies").innerHTML = allteddybear;
}

//Utilisation des fonctions
var teddies = getallteddies(urlApi);
    teddies.then((value) => {
      affichageAllTeddies(value);
    }).catch((error) => {
      var test = '<div class="col-md">' +
                    '<div class="alert alert-danger text-center" role="alert">'+
                    error +
                    '</div>'+
                  '</div>';
      document.getElementById("teddies").innerHTML = test;
      console.log(error);
    })
