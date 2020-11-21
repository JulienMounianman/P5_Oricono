const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);
const storage = localStorage;
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
 * Recupération des parametres id et price de mon url
 *  Affichage de l'id et du prix total de la commande
 */
function confirmation() {
    if (params.has('id') && params.has('price')) {
        const tabPanier = JSON.parse(storage.getItem('Panier'));
        const id = params.get('id');
        const price = params.get('price')
        const resultHTML =
            '<div class="alert alert-success" role="alert">' +
            '<h4 class="alert-heading">Confirmation Commande</h4>' +
            '<p>Voici votre Identifiant de commande : ' + id + '</p>' +
            '<hr>' +
            '<p class="mb-0">Prix total de votre commande :' + price / 100 + '€</p>' +
            '</div>';

        document.getElementById("confirm").innerHTML = resultHTML;
        affichageNbArticlePanier(tabPanier);
    } else {
        window.alert("Erreur");
        window.location.href = adresseActuelle.replace('confirmation', 'index');
    }
}
confirmation();