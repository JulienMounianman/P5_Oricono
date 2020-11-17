const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);
const urlApi = "http://localhost:3000/api/teddies";
const storage = localStorage;
let name = "";
/**
 * Fait un appel get sur une api en fonction d'un id
 *
 * @param {string} url une chaine de caracteres representant l'url de l'api.
 * @param {string} id une chaine de caracteres representant l'id d'un Ours.
 */
function getTeddy(url, id) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url + '/' + id);
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
 * Gère l'affichage d'un ours en peluche sur ma page html.
 *
 * @param {string} url une chaine de caracteres representant la reponse de l'api.
 */
function affichageTeddy(teddy) {
    const results = JSON.parse(teddy);
    const colors = [];
    colors.length = results.colors.length;
    for (let i = 0; i < colors.length; i++) {
        if (i == 0) {
            colors[i] = '<button type="button" class="list-group-item list-group-item-action active" id="color' + i + '">' + results.colors[i] + '</button>';
        } else {
            colors[i] = '<button type="button" class="list-group-item list-group-item-action" id="color' + i + '">' + results.colors[i] + '</button>';
        }
    }
    colors_results = colors.join("");
    const resultHTML =
        '<div class="card text-center">' +
        '<div class="card-header">' +
        '<h5 class="card-title">' + results.name + '</h5>' +
        '</div>' +
        '<img src="' + results.imageUrl + '" class="card-img-top" alt="image' + results.name + '">' +
        '<div class="card-body">' +
        '<p class="card-text">' + results.description + '<span class="badge badge-pill badge-info">' + results.price / 100 + '€</span></p>' +
        '<button id="add" class="btn btn-primary"><span id="spinner"></span> Ajouter au panier</button>' +
        '</div>' +
        '<div id="message">' +
        '</div>' +
        '<div class="card-footer text-muted">' +
        '<div class="list-group" id="colors">' +
        '</div>' +
        '</div>' +
        '</div>';
    document.title = "Oricono | " + results.name;
    document.getElementById("teddy").innerHTML = resultHTML;
    document.getElementById("colors").innerHTML = colors_results;
    const btnContainer = document.getElementById("colors");
    const btns = btnContainer.getElementsByClassName("list-group-item");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            eventColor(btnContainer, this)
        });
    }
}

function eventColor(btnContainer, currentColor) {
    const current = btnContainer.getElementsByClassName("active");
    current[0].classList.remove("active")
    currentColor.classList.add("active");
}
/**
 * Verifie si un parametre est présent dans l'url.
 * Ajoute un ours dans le panier (loacalStorage).
 * Supprime le parametre après l'ajout de l'ours dans le panier.
 * Ajoute tous le contenu de mon panier dans un tableau JS.
 */
function GestionPanier() {
    if (params.has('id')) {
        const id = params.get('id');
        const tabPanier = JSON.parse(storage.getItem('Panier'));
        let bool = false;
        if (tabPanier != null) {
            for (let i = 0; i < tabPanier.length; i++) {
                if (tabPanier[i].id === id) {
                    tabPanier[i].quantity = tabPanier[i].quantity + 1;
                    bool = true;
                }
            }
            if (!bool) {
                const oursObject = {
                    id,
                    quantity: 1
                }
                tabPanier.push(oursObject);
            }
            addPanier(tabPanier);
        } else {
            const oursObject = {
                id,
                quantity: 1
            }
            addPanier([oursObject]);
        }
    }
}

function addPanier(panier) {
    const resultHTML = '<div class="col-md">' +
        '<div class="alert alert-success text-center" role="alert">' +
        'L' + "'" + 'ours ' + name + 'a été ajouté au panier'
    '</div>' +
    '</div>';
    const spinner = '<span class="spinner-border spinner-border-sm"></span>';
    storage.setItem('Panier', JSON.stringify(panier));
    document.getElementById("add").disabled = true;
    document.getElementById("spinner").innerHTML = spinner;
    setTimeout(function () {
        document.getElementById("message").innerHTML = resultHTML;
        document.getElementById("spinner").innerHTML = "";
        setTimeout(function () {
            document.getElementById("message").innerHTML = "";
            document.getElementById("add").disabled = false;
        }, 1500);
    }, 1500);
}

function main() {
    //Verification d'un parametre id dans mon url
    if (params.has('id')) {
        const id = params.get('id');
        //Utilisation des fonctions
        const teddy = getTeddy(urlApi, id);
        teddy.then((value) => {
            affichageTeddy(value);
            const add = document.getElementById("add");
            add.onclick = function () {
                GestionPanier();
            }
        }).catch((error) => {
            const resultHTML = '<div class="col-md">' +
                '<div class="alert alert-danger text-center" role="alert">' +
                error +
                '</div>' +
                '</div>';
            document.getElementById("teddy").innerHTML = resultHTML;
        })
    }
}

main();