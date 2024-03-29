(function () {
    var next;
    var baseUrl = "https://elegant-croissant.glitch.me/spotify";
    var img;
    // ################v  1. SUBMIT BUTTON#   ####################

    $(document).bind('keypress', function (e) {
        if (e.keyCode == 13) {
            $('#submit-button').trigger('click');
        }
    });

    $("#submit-button").on("click", function () {
        var userInput = $('input[name="user-input"]').val();


        var radioInput = $('input[name="category"]:checked').val();

        $(".results-container").empty();

        $.ajax({
            url: baseUrl,
            data: {
                query: userInput, //what user put in input field
                type: radioInput
            },
            success: function (payload) {
                payload = payload.artists || payload.albums; //split
                next =
                    payload.next &&
                    payload.next.replace(
                        "https://api.spotify.com/v1/search",
                        baseUrl
                    );
                console.log("payload: ", payload);



                //now to access the array
                var html = "";
                for (var i = 0; i < payload.items.length; i++) {

                    var extUrl = payload.items[i].external_urls.spotify;
                    if (payload.items[i].images.length > 0) {
                        img = payload.items[i].images[1].url;

                    } else {
                        img = "./img/no-image.jpeg";
                    }
                    //closes if

                    // inserts Album Cover and Name
                    html +=

                        '<div class="name"><a href="' +
                        extUrl +
                        '" target="_blank" rel="nofollow"><span><img src="' +
                        img +
                        '"></span><p clas="item-title">' +
                        payload.items[i].name +
                        "</p></a></div>";
                } //close forloop



                if (payload.total > 20) {
                    var button = $('<button id="loadmore-button">Load more!</button>');
                    $(".results-container").append(html);
                    $(".loadmore-container").append(button);
                } else {
                    $(".results-container").append(html);
                }


                if (location.search.indexOf('scroll=infinite') > -1) {
                    infiniteScrollCheck();
                }



            } //closes success
        }); //closes ajax request
    }); //closes Submit-Btn Event




    // ##############################LOAD MORE BUTTON #############

    $(document).on("click", "#loadmore-button", function () {

        $.ajax({
            url: next,
            success: function (payload) {
                payload = payload.artists || payload.albums;
                next =
                    payload.next &&
                    payload.next.replace(
                        "https://api.spotify.com/v1/search",
                        baseUrl
                    );


                var html = "";

                for (var i = 0; i < payload.items.length; i++) {
                    var extUrl = payload.items[i].external_urls.spotify;
                    if (payload.items[i].images.length > 0) {
                        img = payload.items[i].images[1].url;

                    } else {
                        img = "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-spotify-1.png";
                    }
                    //closes if

                    // inserts Album Cover and Name
                    html +=
                        '<div class="name"><a href="' +
                        extUrl +
                        '" target="_blank" rel="nofollow"><span><img src="' +
                        img +
                        '"></span><p>' +
                        payload.items[i].name +
                        "</p></a></div>";
                } //close forloop
                $(".results-container").append(html);
            } //closes success
        }); //closes ajax request
    }); // closes load more Button Event

    var timerId;

    function infiniteScrollCheck() {


        clearTimeout(timerId);

        // ################### INFINITE SCROLL 
        if (
            $(document).scrollTop() + $(window).height() >= $(document).height() - 200
        ) {
            $.ajax({
                url: next,
                success: function (payload) {
                    payload = payload.artists || payload.albums; //split
                    next =
                        payload.next &&
                        payload.next.replace(
                            "https://api.spotify.com/v1/search",
                            baseUrl
                        );


                    var html = "";

                    for (var i = 0; i < payload.items.length; i++) {
                        var extUrl = payload.items[i].external_urls.spotify;
                        if (payload.items[i].images.length > 0) {
                            img = payload.items[i].images[1].url;

                        } else {
                            img = "https://cdns.iconmonstr.com/wp-content/assets/preview/2017/240/iconmonstr-spotify-1.png";
                        }
                        //closes if

                        // inserts Album Cover and Name
                        html +=
                            '<div class="name"><a href="' +
                            extUrl +
                            '" target="_blank" rel="nofollow"><span><img src="' +
                            img +
                            '"></span><p>' +
                            payload.items[i].name +
                            "</p></a></div>";
                    } //close forloop
                    $(".results-container").append(html);
                } //closes success
            }); //closes ajax request
            // get more results here
        }
        timerId = setTimeout(infiniteScrollCheck, 1000);

    }

})(); //closes iife