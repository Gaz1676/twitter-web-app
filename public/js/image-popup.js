$(document).ready(function () {

    $('.lightbox').click(function () {

        console.log('You clicked the image');

        var windowHeight = window.innerHeight || $(window).height(),
            windowWidth = window.innerWidth || $(window).width();

        // Create the overlay, append it to body and make it visible.
        $('<div id="overlay"></div>')
            .css('opacity', '0')
            .animate({
                opacity: '0.9',
              }, 'slow')
            .appendTo('body');


        // Create the lightbox container which shall contain the image
        $('<div id="lightbox"></div>')
            .hide()
            .appendTo('body');


        // Create img-element and add to #lightbox when loaded.
        $('<img>')
            .attr('src', $(this).attr('src'))
            .css({
                'max-height': windowHeight,
                'max-width': windowWidth,

              })
            .load(function () {
                $('#lightbox')
                    .css({
                        top: (windowHeight - $('#lightbox').height()) / 2,
                        left: (windowWidth - $('#lightbox').width()) / 2,
                      })
                    .fadeIn();
              })
            .appendTo('#lightbox');


        // Remove lightbox on click
        $('#overlay, #lightbox').click(function () {
            $('#overlay, #lightbox').remove();
          });

        console.log('Display image in colorbox.');
      });


    console.log('Everything is ready.');
  });
