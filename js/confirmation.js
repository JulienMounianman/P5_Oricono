var adresseActuelle = window.location.href;
var url = new URL(adresseActuelle);
var params = new URLSearchParams(url.search);

if(params.has('id')) {
  var id = params.get('id');
    if (params.has('price')) {
      var price = params.get('price')
      var test =
                '<div class="alert alert-success" role="alert">'+
                  '<h4 class="alert-heading">Confirmation Commande</h4>'+
                  '<p>Voici votre Identifiant de commande : '+ id +'</p>'+
                  '<hr>'+
                  '<p class="mb-0">Prix total de votre commande :'+ price +'</p>'+
                  '</div>';

      document.getElementById("confirm").innerHTML = test;
    }
  } else {
    window.alert("Erreur");
    window.location.href = adresseActuelle.replace('confirmation','index');
  }
