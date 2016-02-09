$(document).ready(init);
var albums = [];
var tableAlbumsRows = [];

function init() {
  console.log('albumsList init');
  getAlbums();
  $('.saveIt').on('click', newAlbum);
  $('#list').on('click', '.delete', deleteAlbum);
  $('#list').on('click', '.view', showAlbum);
}

function getAlbums(){
  //debugger;
  $.get('/album/getalbums')
  .done(function(data) {
      albums = data;
      displayAlbums();
   })
  .fail(function(err){
    console.log(err)
    alert(err);
  })

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
  var $row = $(this).closest('tr');
  albumIndex = $row.index();  // no -1 because of headers
  var album = albums[albumIndex];
  var id = album._id;

  $.ajax({
    method: "DELETE",
    url: "/album/" + id + '/' + albumIndex
  })
  .done(function(status){
    getAlbums();
});
}

function showAlbum(){
  var $row = $(this).closest('tr');
  albumIndex = $row.index();  // no -1 because of headers
  var album = albums[albumIndex];
  var id = album._id;

  location.href = '/album/showAlbum/' + id + '/' + album.name + '/' + album.description;
}

function displayAlbums(){
  $('#list').empty();
  tableAlbumsRows.splice(0, tableAlbumsRows.length);



  tableAlbumsRows = albums.map(function(item, index){
    var $tr = $('#template').clone();
    $tr.removeClass('hidden');
    $tr.removeAttr('id');
    $tr.find('.name-col').text(item.name);
    $tr.find('.description-col').text(item.description);
    return $tr;
  });

  $('#list').append(tableAlbumsRows);
}








