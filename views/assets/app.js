 // First thing: ask the back end for json with all animals
  $.getJSON("/all", function(data) {
    // Call our function to generate a table body
    $("#newsContent").empty();

    data.forEach(function(news) {

      var newsDiv = $('<div>').attr('class', 'newsDiv');
      var commentButton = $('<button>').attr('class', 'pinkButton').attr('id', 'rightButton').attr('method', 'post').attr('value','/comment');
      commentButton.text('Comment');

      newsDiv.append('<a href=' + news.link + ' target="_blank">' + news.title + '</a><BR>' + news.summary + '<BR> By: ' + news.author + '<BR>');
      newsDiv.append(commentButton);
      $("#newsContent").append(newsDiv);

      hideButton();
    });
  });
  
  function hideButton() {
    $('#getNewsButton').hide();
  }