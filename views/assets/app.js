 // First thing: ask the back end for json with all animals
  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    $("#newsContent").empty();

    data.forEach(function(news) {

      var newsDiv = $('<div>').attr('class', 'newsDiv');

      newsDiv.append('<a href=' + news.link + '>' + news.title + '</a><BR>' + news.summary + '<BR> By: ' + news.author);
      $("#newsContent").append(newsDiv);

      hideButton();
    });
  });
  
  function hideButton() {
    $('button').hide();
  }