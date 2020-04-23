$( '.slider' ).on( 'input', function( ) {
    $( this ).css( 'background', 'linear-gradient(to right, #0B8B8C 0%, #0B8B8C '+this.value +'%, #E1E1E1 ' + this.value + '%, #E1E1E1 100%)' );
  } );
