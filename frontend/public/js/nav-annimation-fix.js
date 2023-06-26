function arrowRotate(icone) {
	let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
	if(width >= 768){
		let cssAncora = $(icone.querySelector('a'));
		let cssSpan = $(icone.querySelector('span'));
		cssAncora.toggleClass('pintarLink');
		cssSpan.toggleClass('down');
	}
		
}

// // $(document).ready(function() {
//     // $('#example').DataTable(
// 	   //  {
// 		 	// language: {
// 		  //       processing:     "Traitement en cours...",
// 		  //       search:         "Pesquisar&nbsp;:",
// 		  //       lengthMenu:     "Mostrando _MENU_ elementos por página",
// 		  //       info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
// 		  //       infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
// 		  //       infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
// 		  //       infoPostFix:    "",
// 		  //       loadingRecords: "Chargement en cours...",
// 		  //       zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
// 		  //       emptyTable:     "Aucune donnée disponible dans le tableau",
// 		  //       paginate: {
// 		  //           first:      "Premier",
// 		  //           previous:   "Pr&eacute;c&eacute;dent",
// 		  //           next:       "Suivant",
// 		  //           last:       "Dernier"
// 		  //       },
// 		  //       aria: {
// 		  //           sortAscending:  ": activer pour trier la colonne par ordre croissant",
// 		  //           sortDescending: ": activer pour trier la colonne par ordre décroissant"
// 		  //       },        
// 	   //  	}
// 	   //  }

//     // );


//     // Setup - add a text input to each footer cell
// //     $('#example tfoot th').each( function () {
// //         var title = $(this).text();
// //         $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
// //     } );

// //     // DataTable
// //     var table = $('#example').DataTable();

// //     // Apply the search
// //     table.columns().every( function () {
// //         var that = this;

// //         $( 'input', this.footer() ).on( 'keyup change', function () {
// //             if ( that.search() !== this.value ) {
// //                 that
// //                     .search( this.value )
// //                     .draw();
// //             }
// //         } );
// //     } );
// // } );


// $(document).ready(function() {
// 	$('#example').dataTable( {
// 		// serverSide: true,
// 		// searching: true,
// 		// ajax: {
// 		// 	url: "myajax.php"
// 		// },
// 		// dom: "rtiS",
// 		"columns": [
// 		    { "orderable": true }, 
// 		    { "orderable": true }, 
// 		    { "orderable": true }, 
// 		    { "orderable": false },
// 		    { "orderable": false },
// 	  	]
// 		// "order": [[1, 'asc']],
// 		// deferRender: true,
// 		// scrollY: 800,
// 		// scrollCollapse: true
// 	} );
// });