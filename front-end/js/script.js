const adresseActuelle = window.location.href;
const url = new URL('produit.html', adresseActuelle);
const urlApi = "http://localhost:3000/api/teddies";
const storage = localStorage;
/**
 * Fait un appel get sur une api
 *
 * @param {string} url une chaîne de caractères representant l'url de l'api.
 */
function getallteddies(url) {
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
            reject("Connexion à l'API impossible");
        };
        xhr.send();
    });
}
/**
 * Gère l'affichage de tous les ours en peluche sur ma page html
 *
 * @param {string} allteddies une chaîne de caractères representant la réponse de l'api.
 */
function affichageAllTeddies(allteddies) {
    const results = JSON.parse(allteddies);
    const teddies = [];
    for (let x in results) {
        const urlproduit = url + '?id=' + results[x]._id
        const resultHTML =
            '<div class="col-md-3 cardIndex">' +
            '<div class="card">' +
            '<img src="' + results[x].imageUrl + '" class="card-img-top" width="320" height="210" alt="image' + results[x].name + '">' +
            '<div class="card-body">' +
            '<h2 class="card-title">' + results[x].name + '</h2>' +
            '<span class="badge badge-pill badge-info">' + results[x].price / 100 + '€</span>' +
            '<p class="card-text">' + results[x].description + '</p>' +
            '<a href="' + urlproduit + '" class="btn btn-primary">Plus d' + "'" + 'infos</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        teddies[x] = resultHTML;
    }
    document.getElementById("teddies").innerHTML = teddies.join("");
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
 * Execution de mes fonctions getallteddies, affichageAllTeddies
 */
function main() {
    const teddies = getallteddies(urlApi);
    const tabPanier = JSON.parse(storage.getItem('Panier'));
    teddies.then((value) => {
        affichageAllTeddies(value)
        affichageNbArticlePanier(tabPanier)
    })
        .catch((error) => {
            const resultHTML = '<div class="col-md">' +
                '<div class="alert alert-danger text-center" role="alert">' +
                error +
                '</div>' +
                '</div>';
            document.getElementById("teddies").innerHTML = resultHTML;
            console.log(error);
        })
}

main();