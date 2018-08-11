(function() {

  Vue.config.devtools = true

  Vue.component('InputTag', {
    template: '#InputTag-template',
    props: {
      tags: {
        type: Array,
        default: () => [],
      },
      placeholder: {
        type: String,
        default: '',
      },
      readOnly: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        newTag: '',
      };
    },
    methods: {
      openModal: function(item) {
        this.showUserModal = true;
        this.user = item;
      }
    },
    methods: {
      focusNewTag() {
        if (this.readOnly) { return; }
        this.$el.querySelector('.new-tag').focus();
      },
      addNew(tag) {
        // Si existe un string y no un espacio vacio Y esta palabra no esta ya en el array Y es menor a la longitud maxima permitida
        if (tag && !this.tags.includes(tag) && this.tags.length < 3) {
          this.tags.push(tag);
          this.tagChange();
        }
        this.newTag = '';
      },
      remove(index) {
        this.tags.splice(index, 1);
        this.tagChange();
      },
      removeLastTag() {
        if (this.newTag) { return; }
        this.tags.pop();
        this.tagChange();
      },
      getPlaceholder() {
        if (!this.tags.length) {
          return this.placeholder;
        }
        return '';
      },
      tagChange() {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)));
        }
      },
    },
  });

  var liked = document.getElementById('liked') ? document.getElementById('liked').dataset.liked == "true" : false;

  var solution = new Vue({
    el: '#solution',
    data: {
      id: document.getElementById('solutionContainer').dataset.id, // El id lo uso para saber si ya existe un documento creado o no
      solution:{
        teams:[],
        tags:[],
        published: false
      },
      user:{},
      active: liked,
      buttonText:'Agregar',
      likedText: 'Quitar',
      editStatus: false,
      inputTag: true
    },
    methods: {
      alert: function(message, type){
        notie.alert(type, message, 5);
      },
      liked: function() {
        // ========================================================================
        // Permite eliminar de favoritos una solucion
        // ========================================================================
        if(this.active){
          this.$http.delete('/api/v1/favorite/' + this.id).then((response) => {
            this.alert(response.data.message, "error");
            this.active = false;
          }, (response) => {
            this.alert(response.data.message, "error");
          });
        }else {
          // ========================================================================
          // Permite agregar a favoritos una solucion
          // ========================================================================
          this.$http.post('/api/v1/favorite/' + this.id).then((response) => {
            this.alert(response.data.message, "success");
            this.active = true;
          }, (response) => {
            this.alert(response.data.message, "error");
          });
        }
      },
      // ========================================================================
      // Permite guardar el contenido del div editable de medium-editor
      // ========================================================================
      saveSolution: function() {
        var postTitle = titleEditor.serialize();
        var postContent = bodyEditor.serialize();

        var data = {
          title: postTitle['post-title']['value'],
          body: postContent['post-body']['value'],
          tags: this.solution.tags,
          published: this.solution.published,
          teams: this.solution.teams
        }

        if(this.id){
          this.$http.put('/api/v1/solution/' + this.id, data).then((response) => {
            console.log(response.data);
            this.alert(response.data.message, "success");
          }, (response) => {
            this.alert(response.data.message, "error");
          });
        }else{
          this.$http.post('/api/v1/solution/', data).then((response) => {
            this.alert(response.data.message, "success");
            // cambia la ruta agregandole el ID de la solucion actual guardada
            history.pushState({}, "Nueva Solucion", response.data._id);
            // Se debe guardar el ID generado para usarlo en las funciones posteriores
            this.id = response.data._id;
          }, (response) => {
            this.alert(response.data.message, "error");
          });
        }

      },
      // ========================================================================
      // Permite eliminar una solucion
      // ========================================================================
      deleteSolution: function() {
        this.$http.delete('/api/v1/solution/' + this.id).then((response) => {
          this.alert(response.data.message, "success");
          setTimeout(() => {
              // history.go(-1);  // back history
              window.location.href = "/";
          }, 1000);
        }, (response) => {
          this.alert(response.data.message, "error");
        });
      },
      edit: function(){
        this.editStatus = true;
        this.inputTag  = false;

        titleEditor.setup();
        bodyEditor.setup();

        this.$http.get('/api/v1/user/teams').then((response) => {
          this.user =  response.data;
        }, (response) => {
          this.alert(response.data.message, "error");
        });

      },
      cancel: function(){
        this.editStatus = false;
        this.inputTag  = true;
        titleEditor.destroy();
        bodyEditor.destroy();
      },
      styleCode: function(){
        this.editStatus = false;
        this.inputTag  = true;
        titleEditor.destroy();
        bodyEditor.destroy();
      }
    },
    mounted: function(){
      // ====================================================================================================================
      // Se ejecuta SI existe un ID en el documento
      // ====================================================================================================================
      if (this.id) {
        this.$http.get('/api/v1/solution/' + this.id).then((response) => {
          this.solution = response.data;
          document.title = this.solution.title;

          function styleCode() {
            $('pre').each(function() {
              if (!$(this).hasClass('prettyprint')) {
                $(this).addClass('prettyprint');
              }
            });
            prettyPrint();
          }

          $(function() {styleCode();});


        }, (response) => {
          this.alert(response.data.message, "error");
        });
      }else {
        this.inputTag  = false;
        titleEditor.setup();
        bodyEditor.setup();

        this.$http.get('/api/v1/user/teams').then((response) => {
          this.user =  response.data;
        }, (response) => {
          this.alert(response.data.message, "error");
        });
      }

    }

  })
})();
