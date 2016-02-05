$(document).ready(init);
var albums = [];
var tableAlbumsRow = [];

function init() {
  getAlbums();
  $('.btn-sucess').on('click', newAlbum);
  $('#list').on('click', '.delete', deleteAlbum);
  $('#list').on('click', '.edit', showAlbum);
}

function getAlbums(){
  //debugger;
  $.get('/album/getalbums', function(data) {
    console.log('data:', data)
      albums = data;
      displayItems();
   });
}

function newAlbum(){
  var name = $('#name').val();
  var description = $('#description').val();
  var anAlbum = {};

  anAlbum.name = name;
  anAlbum.description = description;
  anAlbum.photos = [];

  $.post("/album/createalbum", anAlbum)
  .done(function(data){
    getAlbums();
  })
  .fail(function(err){
    console.log(err)
    alert(err);
  })
}

function deleteAlbum(){
  var index = $(this).closest('.row-container').index() - 1;
  var album = albums[index];
  var id = album._id;

  $.ajax({
    method: "DELETE",
    url: "/album/" + id
  })
  .done(function(status){
    getAlbums();
  });
}

function showAlbum(){
  var index = $(this).closest('.row-container').index() - 1;
  var album = albums[index];
  var id = album._id;

  location.href = '/albums/showAlbum/' + id;
}

function displayItems(){
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

  albums.map(function(item){
    var $row = $('<tr>').addClass('row row-container');
    var $col = $('<td>').addClass('name-col ').text(item.name);
    $row.append($col);
    var $description = $('<td>').addClass('description-col ').text(item.description);
    $row.append($description);
    var $deleteBtn = $('<button>').addClass('delete description-col ').text('Delete');
    $row.append($deleteBtn);
    var $edit = $('<button>').addClass('edit description-col ').text('View');
    $row.append($edit);

    tableAlbumsRow.push($row);
  });

  $('#list').append(tableAlbumsRow);
}








