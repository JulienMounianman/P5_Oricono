var request = new XMLHttpRequest();
var adresseActuelle = window.location.href;
var url = new URL('produit.html',adresseActuelle);

request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var json = JSON.parse(request.responseText);
        var results = json;
        var teddies = [];
        teddies.length = 4;
        for (var x in results) {
          var urlproduit = url + '?id=' + results[x]._id
            var test =
            '<div class="col-">' +
              '<div class="card" style="width: 18rem;">'+
                '<img src="'+ results[x].imageUrl +'" class="card-img-top" width="320" height="210" alt="image'+ results[x].name +'">'+
                '<div class="card-body">'+
                  '<h5 class="card-title">'+ results[x].name +'</h5>'+
                  '<p class="card-text">'+ results[x].description +'<span class="badge badge-pill badge-info">'+ results[x].price +'</span></p>'+
                  '<a href="'+ urlproduit +'" class="btn btn-primary">Plus d'+ "'"+ 'infos</a>'+
                  '</div>'+
              '</div>' +
            '</div>';
               teddies[x] = test;
        }
        var allteddybear = teddies.join("");
        document.getElementById("teddies").innerHTML = allteddybear;
    }
};
request.open("GET", "http://localhost:3000/api/teddies");
request.send();
