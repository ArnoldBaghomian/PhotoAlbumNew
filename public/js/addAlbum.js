$(document).ready(init);

function init(){
  console.log('inside init of createItem.js');  
  $('#create-item-btn').on('click', createItemBtn);
  $('#logme').hide();
    $('#regme').hide();
}

function createItemBtn(){
  console.log('inside createItemBtn() in createItem.js');
  var album = $('#album').val();
  
  var itemObject={
      album: album
      };

  console.log('item object to post', itemObject);

  $.post('/addAlbum', itemObject)
  .success(function(data) {
    console.log('item objected posted', itemObject);
    location.href = '/albumsList';
  }).fail(function(err) {
    alert('something went wrong :(')
  }); 
}