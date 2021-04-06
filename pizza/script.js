$(document).ready(function () {
    $("#objednavka-shrnuti").html("<em>Nemate nic vybrano</em>");
    $("#pizza-shrnuti").html("<em>Zatim zadna pizza</em>");
    var ingredientArray = document.getElementsByName("ingredience[]");
    //console.log(ingredientArray);

    var cena;
    $(".pizza").click(function () {
        $("#pizza-shrnuti").text(this.getAttribute("data-pizzaType"));
        cena = parseInt(this.getAttribute("data-price"));
        $("#zaPizzu").text(cena);
        console.log(pocet);
    });

    var pocet = 1;
    $("#pocet").change(function () {
        pocet = parseInt(this.value);
        $("#zaPizzu").text(pocet * cena);
        console.log(pocet);
        $("#pizza-pocet").html(pocet + " ks<br>");
    });

    var zaDoplnky;
    $(".ingredience-navic").click(function () {
        var pridat = "";
        zaDoplnky = 0;
        for (let index = 0; index < ingredientArray.length; index++) {
            if (ingredientArray[index].checked) {
                pridat += ingredientArray[index].getAttribute("data-value") + "<br>";
                zaDoplnky += parseInt(ingredientArray[index].getAttribute("data-price"));
            }
            $("#pridano").html(pridat);
            $("#zaPizzu").text(pocet * (cena + zaDoplnky));
        }
    });

    var zaTutoPizzu;
    var celkem = 0;
    $("#pridej").click(function () {
        zaTutoPizzu = pocet * (cena + zaDoplnky);
        $("#kosik").append("<div class='polozka' data-price=" + zaTutoPizzu + ">" + $("#pizza-shrnuti").html() + "<br>" + $("#pridano").html() + "<br>" + $("#pizza-pocet").html() + "<button class='odebrat'>Odebrat</button></div>");

        for (let index = 0; index < ingredientArray.length; index++) {
            ingredientArray[index].checked = false;
        }
        celkem += zaTutoPizzu;
        $("#zaPizzu").text(celkem);
        zaDoplnky=0;
        $("#pizza-shrnuti").text("Vyberte dalsi pizzu");
        $("#pridano").text("");
        $("#pizza-pocet").text("");
        $("#pocet").val(1);
    });

    $(document).on('click', '.odebrat', function () {
        $(this).closest('.polozka').remove();
        //bud...
        // cenaKodecteni = $(this).closest('.polozka').attr("data-price");
        // celkem-=parseInt(cenaKodecteni);
        //...anebo...
        celkem -= parseInt($(this).closest('.polozka').attr("data-price"));
        $("#zaPizzu").text(celkem);
    });

    $("#odeslat").click(function () {
        $('#odeslat').before('<p id="odeslani-zprava">Objednavka odeslana! </p>');
        $(this).addClass("odeslano");
        // });
    });

});