$(document).ready(function(){
    $('#searchImg').click(function(){
        $('#page').val('1');
        navPage();
    });

    if(typeof(Storage)!=="undefined")
    {
        if(localStorage.favImages)
        {
            $('#fav').html(localStorage.favImages);
        }
    }
    else
    {
        alert("Sorry! No web storage support..");
    }
});

function setMainImg(imgUrl, imgTitle)
{
    $('#left_div').html('');
    $('#left_div').append($('<div/>')
        .attr("id", 'main_img_div')
        .append($("<img/>")
            .attr("src", imgUrl)
            .attr("id", 'main_img')
        )
    )
    .append($('<div/>')
        .attr("id", 'main_img_title')
        .text(imgTitle)
    );
}

function pageBack()
{
    if($('#page').val() != 1)
    {
        $('#page').val(parseInt($('#page').val()) - 1); 
    }
    navPage();
}

function pageForward()
{
    $('#page').val(parseInt($('#page').val()) + 1); 
    navPage();
}

function navPage()
{
    if($.trim($('#searchImgText').val()) !== '')
    {
        var main_img = 0;
        $('#left_div').html('');
        $("#images").html('');
        $('#nav_forward').fadeOut();
        $('#nav_back').fadeOut();
        $.ajax({
            url: "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=340aa607ac2d150d17fdca20882cf56a&&safe_search=1&format=json&jsoncallback=?",
            dataType: "json",
            type: "GET",
            data: {
                tags : $('#searchImgText').val(),
                per_page : '6',
                page : $('#page').val()
            }
        }).done(function( data ) {
            $.each(data.photos.photo, function(i,item){
                $('#nav_forward').fadeOut();
                $('#nav_back').fadeOut();
                var main_src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_n.jpg";
                var main_title = item.title;
                if(main_img == 0)
                {
                    setMainImg(main_src, main_title);
                    main_img = 1;
                }
                var src = "http://farm"+ item.farm +".static.flickr.com/"+ item.server +"/"+ item.id +"_"+ item.secret +"_m.jpg";
                $("#images").append(
                    $('<div/>')
                        .attr("class", 'img_container')
                        .css("cursor", 'pointer')
                        .append($("<img/>")
                            .attr("src", src)
                            .attr("class", 'img')
                            .attr("onmouseover", 'setMainImg(' + JSON.stringify(main_src) + ',' + JSON.stringify(main_title) + ')')
                            .attr("draggable", 'true')
                            .attr("ondragstart", 'drag(event)')
                            .attr("id", "img_" + item.id)
                        )
                );
            });
            if(parseInt(data.photos.pages) > parseInt($('#page').val()))
            {
                $('#nav_forward').fadeIn(800);
            }
            if(parseInt($('#page').val()) > 1)
            {
                $('#nav_back').fadeIn(800);
            }
        }).fail(function(jqXHR, textStatus) {
            alert("Request failed: " + textStatus);
        });
    }
    else
    {
        alert('Please enter value for search');
    }
}

function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("Text",ev.target.id);
}

function drop(ev)
{
    if(ev.target.id == 'fav')
    {
        if($("#fav img").length >= 6)
        {
            alert('You reached maximum limit for local storage images, You can remove image if you want to add more');
        }
        else
        {
            var data=ev.dataTransfer.getData("Text");
            ev.target.appendChild(document.getElementById(data));
            localStorage.favImages = $('#fav').html();
            ev.preventDefault();
        }
    }
    else if(ev.target.id == 'remove')
    {
        var data=ev.dataTransfer.getData("Text");
        var elem = document.getElementById(data);
        elem.parentNode.removeChild(elem);
        localStorage.favImages = $('#fav').html();

    }
    ev.preventDefault();
}