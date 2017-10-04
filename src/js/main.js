var inpakken = [
  {"type": "Camera", "owned": true},
  {"type": "Schoenen", "owned": true},
  {"type": "Verrekijker", "owned": true},
  {"type": "Deet antimuggenmiddel", "owned": false},
  {"type": "Hoofdlamp", "owned": true},
  {"type": "EHBO-setje", "owned": true},
  {"type": "Waterdichte zak", "owned": false},
  {"type": "Kompas", "owned": false},
  {"type": "Satteliet-telefoon", "owned": true},
  {"type": "Speurplaatje", "owned": false},
];
var vliegen = [
  {"type": "Het Natronmeer", "owned": false},
  {"type": "Rijstvelden", "owned": true},
  {"type": "Malé", "owned": true},
  {"type": "Palau", "owned": false},
  {"type": "Het Hilliermeer", "owned": true},
  {"type": "Het Hartrif", "owned": true},
  {"type": "Rivierdelta's", "owned": false},
  {"type": "Cirkelirrigatie", "owned": false},
  {"type": "Zwaveldamp", "owned": true},
  {"type": "Atol", "owned": false},
];

var china = [
  {"type": "Chinese Muur", "owned": true},
  {"type": "Rode Strand", "owned": false},
  {"type": "Pareltoren van het Oosten", "owned": true},
  {"type": "Cinnaber", "owned": false},
  {"type": "Regenboogbergen", "owned": true},
  {"type": "Gouden Stompneusaap", "owned": true},
  {"type": "Nationaal park Zhangjiajie", "owned": true},
  {"type": "Temmincks Saterhoen", "owned": true},
  {"type": "Terracotta-leger", "owned": true},
  {"type": "Zijderlips", "owned": false},
];


$(document).ready(function(){
  pad = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  fillList = function(arr, el) {

    for (var i = 0; i < arr.length; i++) {
      var cardType = Object.values(arr[i])[0];
      var cardNumber = arr.indexOf(arr[i]) + 1;


      if(arr[i].owned == true) {
        el.append('<li class="owned"><span>' + pad(cardNumber, 3) +'</span><span class="card-type">' + cardType + '</span</li>');
      } else {
        el.append('<li><span>' + pad(cardNumber, 3) +'</span><span class="card-type">' + cardType + '</span</li>');
      }
    }
  }

  fillList(inpakken, $('.inpakken-cards'));
  fillList(vliegen, $('.vliegen-cards'));
  fillList(china, $('.china-cards'));

});

// $(document).ready(function(){
//
//   printValues = function(obj) {
//     for (var key in obj) {
//       if (typeof obj[key] === "object") {
//         printValues(obj[key]);
//       } else {
//         if (key == "owned") {
//           continue;
//         } else {
//           // $('.category').append('<span>' + obj[key]+ '</span>');
//           // $('.inpakken').append('<span>' + wereldplaatjes.Inpakken + '</span>');
//
//         }
//       }
//     }
//   }
//
//   $.each( wereldplaatjes, function( key, value ) {
//     $('.categories').append('<li class="category ' + key.toLowerCase() + '">' + key + '</li>');
//   });
//
//
//   $('.inpakken').append(printValues(wereldplaatjes.Inpakken));
//
// });
