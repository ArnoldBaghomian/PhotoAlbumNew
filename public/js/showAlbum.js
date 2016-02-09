$(document).ready(init);

var photoArray = [];
var tableAlbumsRows = [];

function init() {
    console.log('show album init');
    $('#photoTable').on('click', '.delete', deletePhoto);
    $('#photoTable').on('click', '.view', viewPhoto);
    getPhotos();
}

function deletePhoto() {
    var index = $(this).closest('.row-container').index();
    var image = photoArray[index];
    var id = image._id;
    var albumId = $('.albumID').attr('id');

    $.ajax({
            method: "DELETE",
            url: "/images/" + id + '/' + albumId + '/' + index
        })
        .done(function(status){
            getPhotos();
        });
}




function getPhotos() {

    var albumId = $('.albumID').attr('id');

    $.get('/images/getalbumimages/' + albumId, function (data) {
        photoArray = data;
        showPhotos();
    });
}


function viewPhoto()
{
    var index = $(this).closest('.row-container').index();
    var image = photoArray[index];
    var id = image._id;
    location.href = '/images/viewPhoto/' + id;
}

function showPhotos() {
    $('#photoTable').empty();
    tableAlbumsRows.splice(0, tableAlbumsRows.length);



    photoArray.map(function (photo) {
        var $row = $('<tr>').addClass('row row-container');
        var $image = $('<td>').addClass('image')
        var $img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
        $img.attr('src', photo.url);
        $img.addClass('thumb');
        $image.append($img);
        var $space = $('tr').addClass('row space').css('height', '10px');;
        $row.append($space);
        $row.append($image);

        var $viewBtn = $('<button>').addClass('btn-success view  delete-col').text('View');
        $row.append($viewBtn);
        var $deleteBtn = $('<button>').addClass('btn-danger delete delete-col').text('Delete');
        $row.append($deleteBtn);

        tableAlbumsRows.push($row);
    });

    $('#photoTable').append(tableAlbumsRows);
}

