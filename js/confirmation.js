const adresseActuelle = window.location.href;
const url = new URL(adresseActuelle);
const params = new URLSearchParams(url.search);

if(params.has('id')) {
  const id = params.get('id');
    if (params.has('price')) {
      const price = params.get('price')
      let resultHTML =
                '<div class="alert alert-success" role="alert">'+
                  '<h4 class="alert-heading">Confirmation Commande</h4>'+
                  '<p>Voici votre Identifiant de commande : '+ id +'</p>'+
                  '<hr>'+
                  '<p class="mb-0">Prix total de votre commande :'+ price/100 +'</p>'+
                  '</div>';

      document.getElementById("confirm").innerHTML = resultHTML;
    }
  } else {
    window.alert("Erreur");
    window.location.href = adresseActuelle.replace('confirmation','index');
  }
