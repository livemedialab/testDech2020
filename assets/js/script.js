$(document).ready(function () {
  const inputLocation = $(".input__location");
  let inputLocationVal, searchtext, searchRes;
  let isSet = false;

  function clearLocation() {
    $(".js-tempres").empty().hide();
  }

  function callDecDb(searchtext) {
    var xhr = $.ajax({
      url:
        "https://api-eu.preprod.decathlon.net/dktrent/api/v1/sites/full-text-search.json?fullTextToSearch=" +
        searchtext,
      type: "GET",
      beforeSend: function (xhr) {
        xhr.setRequestHeader(
          "x-api-key",
          "771e8ae7-04ae-498a-8141-5568016852c5"
        );
      },
      success: function (result) {
        searchRes = result;
        elaborateResults(searchRes, searchtext);
        abortAjax(xhr);
      },
    });
  }

  function abortAjax(xhr) {
    if (xhr && xhr.readyState == 4) {
      xhr.abort();
    }
  }

  // activate search on keyup or click on location field

  inputLocation.on("click keydown", function () {
    clearLocation();
    inputLocationVal = $(this).val();
    searchLocation();
  });

  function searchLocation() {
    searchtext = inputLocationVal;
    if (inputLocationVal != "") {
      callDecDb(searchtext);
    } else {
      $(".pac-container").hide();
      clearLocation();
    }
  }

  function elaborateResults(searchRes, searchtext) {
    let arrValRes = [];
    let i = 0;

    if (searchRes.length != 0) {
      $.each(searchRes, function (_index, arrVal) {
        if (arrVal.name.toLowerCase().includes(searchtext)) {
          arrValRes[i++] = arrVal.name;
        }
      });

      if (arrValRes.length != 0) {
        showDecResults(arrValRes);
      } else {
        clearLocation();
        $(".pac-container").show();
        activatePlacesSearch();
      }
    }
  }

  function showDecResults(arrValRes) {
    $(".pac-container").hide();
    clearLocation();

    $.each(arrValRes, function (_index, city) {
      $(".js-tempres").show();
      $(".js-tempres").append("<span>" + city + "</span>");
    });
  }

  // select location result from list and use as location input value

  $("body").on("click", ".js-tempres span", function () {
    inputLocation.val($(this).text());
  });

  $("body").on("click", function () {
    clearLocation();
  });

  function activatePlacesSearch() {
    if (isSet == false) {
      var input = document.getElementById("autocomplete");
      autocomplete = new google.maps.places.Autocomplete(input);
      isSet = true;
    }
    return;
  }

  // --- daterange

  $(".input__daterange").daterangepicker({
    locale: {
      format: "MM/DD/YYYY",
      applyLabel: "Conferma",
      cancelLabel: "Cancella",
    },
  });

  // --- switch language

  function changeMenu() {
    $(".dropdown-menu a").on("click", function () {
      var selText = $(this).text();
      $(".dropdown-toggle").html(selText);
    });
  }

  changeMenu();
});
