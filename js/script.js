const adresseActuelle = window.location.href;
const url = new URL('produit.html',adresseActuelle);
const urlApi = "http://localhost:3000/api/teddies";
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
      if (xhr.status != 200) reject('Error'+xhr.status+':'+ xhr.statusText);
      else resolve(xhr.responseText);
    }
      xhr.onerror = function() {
        reject("Connexion à l'API impossible");
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
  let json = JSON.parse(allteddies);
  let results = json;
  let teddies = [];
  teddies.length = 4;
  for (let x in results) {
    let urlproduit = url + '?id=' + results[x]._id
      let resultHTML =
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
         teddies[x] = resultHTML;
  }
  let allteddybear = teddies.join("");
  document.getElementById("teddies").innerHTML = allteddybear;
}
//Utilisation des fonctions
let teddies = getallteddies(urlApi);
    teddies.then((value) => {
      affichageAllTeddies(value);
    }).catch((error) => {
      let resultHTML = '<div class="col-md">' +
                    '<div class="alert alert-danger text-center" role="alert">'+
                    error +
                    '</div>'+
                  '</div>';
      document.getElementById("teddies").innerHTML = resultHTML;
      console.log(error);
    })
