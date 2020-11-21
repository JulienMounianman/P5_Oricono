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
    const teddies = [];
    let prixtotal = 0;
    const tabPanier = JSON.parse(storage.getItem('Panier'));
    if (tabPanier.length > 0) {
        for (let x in results) {
            for (let i = 0; i < tabPanier.length; i++) {
                if (tabPanier[i].id === results[x]._id) {
                    const resultHTML =
                        '<div class="col-sm-4">' +
                        '<div class="card text-white bg-secondary mb-3">' +
                        '<div class="card-header text-center">' + results[x].name + '</div>' +
                        '<div class="card-body">' +
                        '<h3 class="card-title"> Prix : ' + results[x].price / 100 + '€ </h3>' +
                        '<p class="card-text"> Quantité : ' + tabPanier[i].quantity + '<br>' + tabPanier[i].color + '</p>' +
                        '<img src="' + results[x].imageUrl + '" class="card-img-top imgCardPanier" alt="image' + results[x].name + '">' +
                        '</div>' +
                        '<div class="card-footer text-right" id="divContainer"><button type="button" id="' + i + '" class="btn btn-secondary btn-sm"><i class="far fa-times-circle" "></i></button></div>' +
                        '</div>' +
                        '</div>';
                    teddies[i] = resultHTML;
                    prixtotal = prixtotal + (results[x].price * tabPanier[i].quantity);
                }
            }
        }
        allArticlePanier = teddies.join("");
        const afficherPrixTotal = "Prix total : " + prixtotal / 100 + "€";
        document.getElementById("ListeArcticlePanier").innerHTML = allArticlePanier;
        document.getElementById("prixtotal").innerHTML = afficherPrixTotal;
    } else {
        const panier_vide = '<div class="col-md-12">' +
            '<div class="alert alert-warning text-center" role="alert">' +
            "Le panier est vide"
        '</div>' +
            '</div>';
        document.getElementById("ListeArcticlePanier").innerHTML = panier_vide;
    }

    const divContainer = document.getElementById("ListeArcticlePanier");
    const btns = divContainer.getElementsByClassName("btn-sm");
    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = function () {
            const idElt = this.getAttribute('id');
            deleteArticlePanier(idElt)
        };
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
        xhr.onload = function () {
            if (xhr.status != 200) {
                reject('Error' + xhr.status + ':' + xhr.statusText);
            } else {
                resolve(xhr.responseText);
            }
        }
        xhr.onerror = function () {
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
        xhr.onload = function () {
            if (xhr.status != 201) {
                reject('Error' + xhr.status + ':' + xhr.statusText);
            } else {
                resolve(xhr.responseText);
            }
        }
        xhr.onerror = function () {
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

/**
 * Gère les event "load" et "submit" de mon formulaire
 * 
 */
function gestionForm() {
    window.addEventListener("load", function () {
        const form = document.getElementById("form")
        form.addEventListener("submit", function (event) {
            eventForm(event)
        }, false)
    }, false)
}
/**
 * Récupère et crée un objet contact à partir du contenu de mes champs de mon fomulaire 
 * Récupère le contenu de mon panier dans un tableau "products".
 * crée un objet "finalobj" contenant l'objet "contact" et le tableau "products".
 * Envoie L'objet à l'api, récupère la response et redirige vers confirmation.
 * @param {any} event event "submit" de mon formulaire.
 */
function eventForm(event) {
    event.preventDefault()
    const firstName = form.elements.inputPrenom.value.trim();
    const lastName = form.elements.inputNom.value.trim();
    const address = form.elements.inputAddress.value.trim();
    const email = form.elements.inputAddressElectronique.value.trim();
    const city = form.elements.inputVille.value.trim();

    const tabPanier = JSON.parse(storage.getItem('Panier'));
    const products = [];
    if (tabPanier !== null) {
        for (let i = 0; i < tabPanier.length; i++) {
            if (tabPanier[i].quantity > 1) {
                for (let j = 0; j < tabPanier[i].quantity; j++) {
                    products[j] = tabPanier[i].id
                }
            } else {
                products[i] = tabPanier[i].id;
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
    const finalObj = {
        contact,
        products
    }
    if (verifPanier(products)) {
        const result = postForm(urlApi, JSON.stringify(finalObj));
        result.then((value) => {
            redirectForm(value);
        }).catch((error) => {
            console.log(error);
        })
    }
    form.classList.add("was-validated")
}

/**
 * Verifie si mon panier est vide.
 * @param {array} panier event "submit" de mon formulaire.
 */
function verifPanier(panier) {
    if (panier.length === 0) {
        const panier_vide = '<div class="col-md-12">' +
            '<div class="alert alert-danger text-center" role="alert">' +
            'Panier Vide !!!' +
            '</div>' +
            '</div>';
        document.getElementById("ListeArcticlePanier").innerHTML = panier_vide;
    }
    return (panier.length !== 0);
}

/**
 * Compte le nombres d'articles qu'il y a dans mon panier
 * 
 * @param {any} panier Localstorage
 * 
 */
function affichageNbArticlePanier(panier) {
    let nb = 0;
    let quantity = 0;
    if (panier != null) {
        for (let i = 0; i < panier.length; i++) {
            if (panier[i].quantity > 1) {
                quantity = quantity + (panier[i].quantity - 1);
            }
        }
        nb = quantity + panier.length;
    }
    document.getElementById("nb").innerHTML = nb;
}

/**
 * Gère l'évent click pour supprimer un article
 * 
 *
 * @param {int} id id de l'article
 */
function deleteArticlePanier(id) {
    const tabPanier = JSON.parse(storage.getItem('Panier'));
    if (tabPanier[id].quantity > 1) {
        tabPanier[id].quantity = tabPanier[id].quantity - 1;
    } else {
        tabPanier.splice(id, 1);
    }
    storage.setItem('Panier', JSON.stringify(tabPanier));
    window.location.href = adresseActuelle;
}

/**
 * Utilisation de mes fonctions getAllteddies, affichagePanier
 * Bouton vider le panier (clear)
 */
function gestionTeddies() {
    const teddies = getAllteddies(urlApi);
    const tabPanier = JSON.parse(storage.getItem('Panier'));
    teddies.then((value) => {
        affichagePanier(value);
        affichageNbArticlePanier(tabPanier);
        clear.onclick = function () {
            const newtab = []
            storage.setItem('Panier', JSON.stringify(newtab));
        }
    }).catch((error) => {
        console.log(error)
    })
}
gestionTeddies();
gestionForm();