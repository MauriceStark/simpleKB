
// ====================================
// Iniciador de Typeahead
// ====================================

  /*var tags = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,

    prefetch: {
      url: '/api/v1/admin/tags',
      cache: false,
      filter: function(list) {
        return $.map(list, function(tag) {
          return { name: tag._id };
        });
      }
    },

    // remote: {
    //   url: '/api/v1/tags.json',
    //   rateLimitWait: 1000,
    //   filter: function(list) {
    //     return $.map(list, function(tag) {
    //       return { name: tag._id };
    //     });
    //   }
    // }

  });
*/

var titleEditor = new MediumEditor('.title-editable', {
  toolbar: false,
  placeholder: {
    text: 'Escribe el titulo...',
    hideOnClick: true
  },
  buttonLabels: 'fontawesome',
  disableReturn: true,
  disableDoubleReturn: true,
  disableExtraSpaces: true,
  standardizeSelectionStart: true,
	imageDragging: false,
	// To stop preventing drag & drop events and disable file dragging in general, provide a dummy ImageDragging extension.
	extensions: {
		'imageDragging': {}
	}
});

var bodyEditor = new MediumEditor('.body-editable', {
  toolbar: {
    buttons: [ 'h2', 'h3', 'bold', 'italic', 'underline', 'quote', 'anchor', 'orderedlist', 'unorderedlist', 'pre', 'addImage'],
  }, // , 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'
  placeholder: {
    text: 'Empieza a escribir y seleccionalo para editarlo...',
    hideOnClick: true
  },
  buttonLabels: 'fontawesome',
  paste: {
    forcePlainText: false,
    cleanPastedHTML: true,
    cleanReplacements: [],
    cleanAttrs: ['class', 'style', 'dir'],
    cleanTags: ['meta']
  },
  linkValidation: true,
	autoLink: true,
	/*extensions: {
 		'imageDragging': {},
		//'addImage': new AddImage()
  }*/
});

titleEditor.destroy();
bodyEditor.destroy();
