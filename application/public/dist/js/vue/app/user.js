(function() {
  Vue.config.devtools = true;
  var params = new URLSearchParams(location.search.substr(1));

  /*window.addEventListener("hashchange", function () {
    console.log( window.location.hash);
  });*/

  var app = new Vue({
    el: '#user',
    data: {
      currentView: window.location.hash || "#",
      // Data
      results: {
        objects: [],
        user: {}
      },
      // Array con los usuarios que pertenecen a X equipo
      users: [],
      // String del usuario que se buscara
      username: "",
      // Array con los usuarios que se veran en la busqueda
      userSearch: [],
      // URL de la api y los ID's
      url: '/api/v1/user',
      teamId: "",
      search: "",
    },
    methods: {
      alert: function(message, type){
        notie.alert(type, message, 5);
      },
      // ========================================================================
      // Permite filtrar por tipo la busqueda
      // ========================================================================
      filter: function(param, event){

        if(param == "type") {
          params.set('type', event.target.value);
        }

        // Modifica la URL actual conforme los diferentes parametros de busqueda
        window.history.replaceState({}, '', `${location.pathname}?${params}`);
        // GET /api/v1/user?
        this.$http.get(this.url + "?" + params.toString()).then((response) => {
          this.results = response.data;
        }, (response) => {});
      },

      // ========================================================================
      // Usado para mostrar el CSS de "activo" en el tab actual
      // ========================================================================
      isActive: function(isActive){
        return this.currentView == isActive ? "active" : "" ;
      },
      getItems: function(view){
        this.currentView = view;
      },

      // ========================================================================
      // Permite obtener todos los usuarios que estan en un equipo
      // ========================================================================
      getAllUsers: function(event){
        this.teamId = event.target.value;

        if (this.teamId  != "0") {
          // GET /api/v1/users?teamId=325346575
          this.$http.get("/api/v1/users?teamId=" + this.teamId).then((response) => {
            this.users =  response.data;
          }, (response) => {});
        }else {
          // Cuando es select default
          this.users =  [];
        }
      },

      // ========================================================================
      // Permite buscar un usuario dentro del sistema por su nombre
      // ========================================================================
      searchUser: function(){
        if(this.username){
          // GET /api/v1/users?username=nombre
          this.$http.get("/api/v1/users?username=" + this.username).then((response) => {
            this.userSearch =  response.data;
          }, (response) => {});
        }else {
          // Cuando el input de busqueda no tiene texto
          this.userSearch = [];
        }
      },

      // ========================================================================
      // Permite agregar un usuario a un equipo
      // ========================================================================
      addTeam: function(userId){
        // POST /api/v1/user/:userId/team/:teamId
        this.$http.post(this.url + "/" + userId + "/team/" + this.teamId, {}).then((response) => {
          this.alert(response.data.message, "success");
        }, (response) => {
          this.alert(response.data.message, "error");
        });
      },

      // ========================================================================
      // Permite eliminar un usuario de un equipo
      // ========================================================================
      removeTeam: function(userId){
        // DELETE /api/v1/user/:userId/team/:teamId
        this.$http.delete(this.url + "/" + userId + "/team/" + this.teamId, {}).then((response) => {
          this.alert(response.data.message, "success");
        }, (response) => {
          this.alert(response.data.message, "error");
        });
      },
    },

    // ========================================================================
    // Permite filtrar los objetos
    // ========================================================================
    computed: {
      filteredObjects: function() {

        var self = this;
        var objects;

        // Si la vista actual es en Favoritos los objetos mostrados seran "user.favorites"
        if(this.currentView == "#favorites"){
          objects = this.results.user.favorites;
        }else {
          objects = this.results.objects
        }

        return objects.filter(function(item){
          // Filtra en base a la coincidencia del titulo con el input de busqueda
          return item.title.toLowerCase().indexOf(self.search) > -1;
        })
      }
    },

    // ========================================================================
    // Carga los datos iniciales dependiendo de los parametros de la URL
    // ========================================================================
    mounted: function(){
      this.$http.get(this.url + "?" + params.toString()).then((response) => {
        this.results =  response.data;
      }, (response) => {});

    }
  })
})();
