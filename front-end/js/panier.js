const referrer = document.referrer;
const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);
const storage = localStorage;
const clear = document.getElementById("clear");
const urlApi = "http://localhost:3000/api/teddies";

/**
 * Gère l'affichage des ours en peluche présant dans le panier sur ma page html.
 *
 * @param {string} url une chaine de caracteres representant la reponse de l'api.
 */
function affichagePanier(allteddies) {
    const results = JSON.parse(allteddies);
    let teddies = [];
    let prixtotal = 0;
    let tabPanier = JSON.parse(storage.getItem('Panier'));
    if (tabPanier != null) {
        for (let x in results) {
            for (let i = 0; i < tabPanier.length; i++) {
                if (tabPanier[i].id === results[x]._id) {
                    const resultHTML =
                        '<div class="col-sm-4">' +
                        '<div class="card text-white bg-secondary mb-3" style="max-width: 18rem;">' +
                        '<div class="card-header text-center">' + results[x].name + '</div>' +
                        '<div class="card-body">' +
                        '<h5 class="card-title"> Prix : ' + results[x].price / 100 + '€ </h5>' +
                        '<p class="card-text"> Quantité : ' + tabPanier[i].quantity + '</p>' +
                        '<img src="' + results[x].imageUrl + '" class="card-img-top" width="220" height="120" alt="image' + results[x].name + '">' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    teddies[i] = resultHTML;
                    prixtotal = prixtotal + (results[x].price * tabPanier[i].quantity);
                }
            }
        }
        allArticlePanier = teddies.join("");
        let afficherPrixTotal = "Prix total : " + prixtotal / 100 + "€";
        document.getElementById("ListeArcticlePanier").innerHTML = allArticlePanier;
        document.getElementById("prixtotal").innerHTML = afficherPrixTotal;
    } else {
        let panier_vide = '<div class="col-md-12">' +
            '<div class="alert alert-warning text-center" role="alert">' +
            "Le panier est vide"
        '</div>' +
        '</div>';
        document.getElementById("ListeArcticlePanier").innerHTML = panier_vide;
    }
}

/**
 * Fait un appel get sur une api
 *
 * @param {string} url une chaine de caracteres representant l'url de l'api.
 */
function getAllteddies(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
            if (xhr.status != 200) {
                reject('Error' + xhr.status + ':' + xhr.statusText);
            } else {
                resolve(xhr.responseText);
            }
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
function postForm(url, json) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url + '/order');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status != 201) {
                reject('Error' + xhr.status + ':' + xhr.statusText);
            } else {
                resolve(xhr.responseText);
            }
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
    const results = JSON.parse(response);
    const allPrice = [];
    storage.clear();
    for (let i = 0; i < results.products.length; i++) {
      allPrice[i] = results.products[i].price;
    }
    const price = allPrice.reduce((a, b) => a + b);
    const confirmUrl = url.pathname.replace('panier', 'confirmation') +
        '?id=' + results.orderId +
        '&price=' + price;
    window.location.href = confirmUrl;
}


function gestionForm() {
    window.addEventListener("load", function() {
        let form = document.getElementById("form")
        form.addEventListener("submit", function(event) {
            eventForm(event)
        }, false)
    }, false)
}

function eventForm(event) {
    event.preventDefault()
    const firstName = form.elements.inputPrenom.value.trim();
    const lastName = form.elements.inputNom.value.trim();
    const address = form.elements.inputAddress.value.trim();
    const email = form.elements.inputAddressElectronique.value.trim();
    const city = form.elements.inputVille.value.trim();

    const tabPanier = JSON.parse(storage.getItem('Panier'));
    const panierCommande = [];
    if (tabPanier != null) {
        for (let i = 0; i < tabPanier.length; i++) {
          if( tabPanier[i].quantity > 1){
            for(let j = 0; j < tabPanier[i].quantity; j++) {
              panierCommande[j] = tabPanier[i].id
            }
          } else {
            panierCommande[i] = tabPanier[i].id;
          }
        }
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }
    const contact = {
        firstName,
        lastName,
        address,
        city,
        email,
    }
    const products = panierCommande;
    const finalObj = {
        contact,
        products
    }
    if (panierCommande.length !== 0) {
        const result = postForm(urlApi, JSON.stringify(finalObj));
        result.then((value) => {
            redirectForm(value);
        }).catch((error) => {
            console.log(error);
        })
    } else {
        const panier_vide = '<div class="col-md-12">' +
            '<div class="alert alert-danger text-center" role="alert">' +
            'Panier Vide !!!' +
            '</div>' +
            '</div>';
        document.getElementById("ListeArcticlePanier").innerHTML = panier_vide;
    }
    form.classList.add("was-validated")
}

function gestionTeddies() {
    //Utilisation de mes fonctions getAllteddies, affichagePanier
    const teddies = getAllteddies(urlApi);
    teddies.then((value) => {
        affichagePanier(value);
        //Bouton vider le panier
        clear.onclick = function() {
            storage.clear();
        }
    }).catch((error) => {
        console.log(error)
    })
}

gestionTeddies();
gestionForm();
