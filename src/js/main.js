var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var wereldplaatjes = JSON.parse(this.responseText);
        document.getElementById("demo").innerHTML = JSON.stringify(wereldplaatjes.Inpakken);
        
    }
};
xmlhttp.open("GET", "dest/js/wereldplaatjes.json", true);

xmlhttp.send();
