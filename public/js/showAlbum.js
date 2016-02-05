$(document).ready(init);

var photoArray = [];

function init() {

    getPhotos();
}

function getPhotos() {

    var albumId = $('.itemIdDiv').attr('id');

    $.get('/images/getalbumimages/' + albumId, function (data) {
        photoArray = data;
        showPhotos();
    });
}

function showPhotos() {
    $('#list').empty();
    tableAlbumsRow.splice(0, tableAlbumsRow.length);

    var $titles = $('<tr>').addClass('row-container row-title');
    var $title = $('<td>').addClass('name-title ').text('Name');
    $titles.append($title);
    var $description = $('<td>').addClass('description-title ').text('Description');
    $titles.append($description);
    var $space1 = $('<td>')
    $titles.append($space1);
    var $space2 = $('<td>')
    $titles.append($space2);

    tableAlbumsRow.push($titles);

    photoArray.map(function (item) {
        var $row = $('<tr>').addClass('row row-container');
        var $name = $('<td>').addClass('name-col ').text(item.name);
        $row.append($name);
        var $imageCell = $('<td>').addClass('image')
        var $img = $('<img id="dynamic">'); //Equivalent: $(document.createElement('img'))
        $img.attr('src', item.url);
        $imageCell.append($img);
        $row.append($imageCell);
        var $description = $('<td>').addClass('description-col ').text(item.description);
        $row.append($description);
        var $deleteBtn = $('<button>').addClass('deleteBtn description-col ').text('Delete');
        $row.append($deleteBtn);

        tableAlbumsRow.push($row);
    });

    $('#list').append(tableAlbumsRow);
}


