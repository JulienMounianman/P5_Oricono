const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);
const urlApi = "http://localhost:3000/api/teddies";
/**
 * Fait un appel get sur une api en fonction d'un id
 *
 * @param {string} url une chaine de caracteres representant l'url de l'api.
 * @param {string} id une chaine de caracteres representant l'id d'un Ours.
*/
function getTeddy(url,id) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url + '/'+ id);
    xhr.onload = function() {
      if (xhr.status != 200) reject('Error'+xhr.status+':'+ xhr.statusText);
      else resolve(xhr.responseText);
    }
    xhr.onerror = function() {
      reject("Request failed");
    };
    xhr.send();
  });
}
/**
 * Gère l'affichage d'un ours en peluche sur ma page html.
 *
 * @param {string} url une chaine de caracteres representant la reponse de l'api.
*/
function affichageTeddy(teddy) {
  const panierUrl = adresseActuelle.replace('produit','panier');
  let json = JSON.parse(teddy);
  let results = json;
  let colors = [];
  colors.length = results.colors.length;
  for (let i= 0; i < colors.length; i++) {
    if(i == 0) colors[i] = '<button type="button" class="list-group-item list-group-item-action active" id="color'+i+'">'+results.colors[i]+'</button>';
    else colors[i] = '<button type="button" class="list-group-item list-group-item-action" id="color'+i+'">'+results.colors[i]+'</button>';
  }
  colors_results = colors.join("");
  let resultHTML =
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
  let title = 'Oricono | '+ results.name;
  document.getElementById("teddy").innerHTML = resultHTML;
  document.getElementById("colors").innerHTML = colors_results;
  document.getElementById("title").innerHTML = title;
  let btnContainer = document.getElementById("colors");
  let btns = btnContainer.getElementsByClassName("list-group-item");
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
    let current = btnContainer.getElementsByClassName("active");
    current[0].classList.remove("active")
    this.classList.add("active") ;
    });
  }
}
//Verification d'un parametre id dans mon url
if(params.has('id')) {
  const id = params.get('id');
  //Utilisation des fonctions
  let teddy = getTeddy(urlApi,id);
  teddy.then((value) => {
    affichageTeddy(value);
  }).catch((error) => {
    let resultHTML = '<div class="col-md">' +
                  '<div class="alert alert-danger text-center" role="alert">'+
                  error+
                  '</div>'+
                '</div>';
    document.getElementById("teddy").innerHTML = resultHTML;
  })
}
