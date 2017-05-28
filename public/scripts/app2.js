$(document).ready(function() {
  var resourceContainer = $('#resources');

  // Makes sure people can't add code into text inputs
  function escape(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function getComments() {
    $(".resourceWall").on('click', ".comment", function(event) {
      var resourceid = $(this).attr('data-resourceid');
    $.ajax({
      url: '/api/comments?id=' + resourceid,
      method: 'GET',
      success: function(results) {
        $('.comment-view').empty();
        results.forEach((item) => {
          $('<div>').text(item.username + ': ' + item.comment).appendTo($('.comment-view'));
        });
      }
    })
    });
  }

  function postComments() {
    $(".resourceWall").on('click', ".comment-post", function(event) {
      var resourceid = $(this).attr('data-resourceid');
    $.ajax({
      url: '/api/comments',
      method: 'POST',
      success: function(results) {
        res.end();
      }
    })
    });
  }

  function likesPost() {
    $(".resourceWall").on('click', ".likeicon", function(event) {
      console.log(event);
      var resourceid = $(this).attr('data-resourceid');
      console.log(resourceid);
    $.ajax({
      url: '/api/likebutton/' + resourceid,
      method: 'POST',
      success: function(results) {
        res.end();
      }
    })
    });
  }


  // creates elements on the page for each tweet
  function createResourceElement(resource) {
    let rdi = "${resource.id}";
    const html = `
       <article class="thumbnail" data="resource-${resource.id}">
            <div class="caption">
              <h3 href="${escape(resource.url)}">${escape(resource.title)}</h3>
              <p>${escape(resource.description)}</p>
              <p> Posted by ${resource.username}</p>
            </div>
            <a href="${escape(resource.url)}"><img class="resourceImage" src="${resource.imageURL}"></a>
            <div class = "footer">
              <p>TAG, TAG, TAG</p>
              <input type="image" class="likeicon" src="/images/heart.png" data-resourceid="${resource.id}">
              <li class="dropdown">
                <a href="#" class="dropdown-toggle btn btn-default" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Post a comment<span class="caret"></span></a>
                <div class="dropdown-menu comment-post">
                  <form action="/api/comments" method="POST" data-resourceid="${resource.id}">
                    <textarea name="text" placeholder="What do you think?"></textarea>
                    <input type="Submit" name="${resource.id}">
                  </form>
                </div>
              </li>
              <li class="dropdown">
                <a href="#"  class="dropdown-toggle btn btn-default comment"  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" data-resourceid="${resource.id}">View comments<span class="caret"></span></a>
                <ul class="dropdown-menu comment-view">
                </ul>
              </li>
            </article>
      `;
    return $(html);
  }

  // Renders the tweets via loop and adds them to the top of the page
  function renderResources (data) {
    var resourceContainer = $(".resourceWall");
    resourceContainer.empty();

    data.forEach(function(item) {
      resourceContainer.prepend(createResourceElement(item));
    })

    // for (var i = 0; i < resources.length; i++) {
    //   var resource = resources[i];
    // }
        // seeds.forEach(function(resource){
        // resourceContainer.prepend(createResourceElement(resource));
      // });
     
  }



  // loads the tweets via ajax on success calls on the renderTweets function
  function loadResources() {
    $.ajax({
      url: '/api/profiles',
      method: 'GET',
      success: function(data) {
        // console.log(data);
        renderResources(data);
        getComments();
        likesPost();
      }
    });
  }

  loadResources();
  // renderResources();

});
