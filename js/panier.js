const referrer = document.referrer;
const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);
let storage = localStorage;
let clear = document.getElementById("clear");
const urlApi = "http://localhost:3000/api/teddies";
/**
 * Verifie si un parametre est présent dans l'url.
 * Ajoute un ours dans le panier (loacalStorage).
 * Supprime le parametre après l'ajout de l'ours dans le panier.
 * Ajoute tous le contenu de mon panier dans un tableau JS.
*/

function GestionPanier() {
  if(params.has('id')) {
    const id = params.get('id');
    let previous_id = "no_id";
    if(referrer) {
      const previousUrl = new URL(referrer);
      const previousParams = new URLSearchParams(previousUrl.search);
      previous_id = previousParams.get('id');
    }
    console.log(id + " != " + previous_id);
    if(id != previous_id){
      const tabPanier = JSON.parse(storage.getItem('Panier'));
      let bool = false;
      if(tabPanier != null) {
        for (let i= 0; i < tabPanier.length; i++) {
            if(tabPanier[i].id == id) {
                tabPanier[i].quantity = tabPanier[i].quantity + 1;
                storage.setItem('Panier', JSON.stringify(tabPanier));
                bool = true;
            }
          }
        if(!bool) {
          const oursObject = {
            id,
            quantity: 1
          }
          tabPanier.push(oursObject);
          storage.setItem('Panier', JSON.stringify(tabPanier));
        }
      } else {
        const oursObject = {
          id,
          quantity: 1
        }
        let newtabPanier = [];
        newtabPanier[0] = oursObject;
        storage.setItem('Panier', JSON.stringify(newtabPanier));
      }
      params.delete('id');
      }
    }
}
/**
 * Gère l'affichage des ours en peluche présant dans le panier sur ma page html.
 *
 * @param {string} url une chaine de caracteres representant la reponse de l'api.
*/
function affichagePanier (allteddies) {
  let json = JSON.parse(allteddies);
  let results = json;
  let teddies = [];
  let prixtotal = 0;
  let tabPanier = JSON.parse(storage.getItem('Panier'));
  if(tabPanier != null) {
    for (let x in results) {
      for (let i= 0; i < tabPanier.length; i++) {
        if (results[x]._id == tabPanier[i].id) {
          let color = "secondary";
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

        let resultHTML =
        '<div class="col-sm-3">'+
          '<div class="card text-white bg-'+color+' mb-3" style="max-width: 18rem;">'+
            '<div class="card-header">'+ results[x].name  +'</div>'+
            '<div class="card-body">'+
              '<h5 class="card-title">'+ results[x].price/100  +'</h5>'+
              '<p class="card-text"> quantité : '+ tabPanier[i].quantity +'</p>'+
            '</div>'+
          '</div>'+
        '</div>';
        teddies[i] = resultHTML;
        prixtotal = prixtotal + (results[x].price * tabPanier[i].quantity);
        }
      }
    }
    allArticlePanier = teddies.join("");
    let afficherPrixTotal = "Prix total : " + prixtotal/100;
    document.getElementById("ListeArcticlePanier").innerHTML = allArticlePanier;
    document.getElementById("prixtotal").innerHTML = afficherPrixTotal;
  }
}

/**
 * Fait un appel get sur une api
 *
 * @param {string} url une chaine de caracteres representant l'url de l'api.
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
      reject("Request failed");
    };
    xhr.send();
  });
}

/**
 * Fait un appel get sur une api
 *
 * @param {string} url une chaine de caracteres ezpresentant l'url de l'api.
 * @param {object} json un objet JSON à envoyer vers l'api.
*/
function postForm(url,json) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url + '/order');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status != 201) reject('Error'+xhr.status+':'+ xhr.statusText);
      else resolve(xhr.responseText);
    }
    xhr.onerror = function() {
      reject("Request failed");
    };
    xhr.send(json);
  });
}

/**
 * Supprime tous les articles du panier (localStorage).
 * Calcule le prix de la commande.
 * Redirige vers une url comprenant les paremtères id et price correspondant au prix de la commande et à l'id de la commande
 * @param {string} response une chaine de caracteres representant la reponse de l'api aprés une requête POST.
 *
*/
function redirectForm(response) {
  let json = JSON.parse(response);
  let results = json;
  storage.clear();
  let price = 0;
  for(i=0;i<results.products.length;i++){
    price = price + results.products[i].price;
  }
  let confirmUrl = url.pathname.replace('panier','confirmation') +
                '?id=' + results.orderId +
                '&price=' + price;
  window.location.href = confirmUrl;
}
/**
 * Verification du panier.
 *
 * @param {array} panier un tableau représentant les articles présent dans mon panier(localStorage)
 *
*/
function validatePanier(panier) {
  return new Promise((resolve, reject) => {
    if(panier[0] != null) {
      resolve("Le Panier n'est pas vide");
    }else{
      reject("Le Panier est vide");
    }
  });
}
//Gestion des events load et submit de mon formulaire.
(function() {
  window.addEventListener("load", function() {
    let form = document.getElementById("form")
    //document.getElementById("inputAddressElectronique").pattern = '^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$'
    form.addEventListener("submit", function(event) {
      event.preventDefault()
      const prenom = form.elements.inputPrenom.value.trim();
      const nom = form.elements.inputNom.value.trim();
      const address = form.elements.inputAddress.value.trim();
      const email = form.elements.inputAddressElectronique.value.trim();
      const ville = form.elements.inputVille.value.trim();


      const tabPanier = JSON.parse(storage.getItem('Panier'));
      const panierCommande = [];
        if(tabPanier != null) {
        for (let i= 0; i < tabPanier.length; i++) {
            panierCommande[i] = tabPanier[i].id;
          }
        }

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const contact = {
        firstName: prenom,
        lastName: nom,
        address,
        city: ville,
        email: email
      }

      const products = panierCommande;

      const finalObj = {
        contact: contact,
        products: products
      }

      let testjson = JSON.stringify(finalObj);
      console.log(testjson);

      let verifPanier = validatePanier(panierCommande);
      verifPanier.then((value) => {
        let result = postForm(urlApi,testjson);
        result.then((value) => {
            redirectForm(value);
        }).catch((error) => {
          console.log(error);
        })
      }).catch((error) => {
        let panier_vide = '<div class="col-md-12">' +
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

//Utilisation de mes fonctions getallteddies, GestionPanier, affichagePanier
let teddies = getallteddies(urlApi);
    teddies.then((value) => {
      GestionPanier();
      affichagePanier(value);
    }).catch((error) => {
      console.log(error);
    })

//Bouton vider le panier
  clear.onclick = function() {
    storage.clear();
  }
