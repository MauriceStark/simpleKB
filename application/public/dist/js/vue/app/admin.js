(function() {

  Vue.component('modal-user', {
    template: '#modalUser-template',
    props: ['show', 'user'],
    data(){
      return{
        newTeam: ''
      }
    },
    methods: {
      close: function() {
        //bind sincronizado -> show = showUserModal
        this.show = false;
      },
      save: function(){
        var data = {
          //username: this.user.username,
          teams: this.teams,
          isActive: this.user.isActive,
          isAdmin: this.user.isAdmin,
        };
        this.$http.put('/api/v1/admin/user/' + this.user._id, data).then((response) => {
          console.log(response.data);
        }, (response) => {
          // error callback
        });
      },
      addTeam: function() {
        if (this.newTeam == '') return;
        this.user.teams.push(this.newTeam);
        this.newTeam = ''
      },
      deleteTeam: function(team){
        var index = this.user.teams.indexOf(team);
        this.user.teams.splice(index, 1);
      }
    }
  });

  Vue.component('modal-team', {
    template: '#modalTeam-template',
    props: ['show'],
    data(){
      return {
        team:"",
        leader:""
      }
    },
    methods: {
      close: function() {
        //bind sincronizado -> show = showTeamModal
        this.show = false;
        this.team = "";
        this.leader = "";
      },
      save: function(){
        this.$http.post('/api/v1/admin/team', {team: this.team, leader:this.leader}).then((response) => {
          this.team = "";
          this.leader = "";
        }, (response) => {
          // error callback
        });
      }
    }
  });

  Vue.component('users', {
    template: '#users-template',
    props: ['items'],
    data(){
      return {
        user: {},
        showUserModal: false,
      }
    },
    methods: {
      openModal: function(item) {
        this.showUserModal = true;
        this.user = item;
      }
    }
  })

  Vue.component('solutions', {
    template: '#solutions-template',
    props: ['items'],
  })

  Vue.component('tags', {
    template: '#tags-template',
    props: ['items'],
  })

  Vue.component('series', {
    template: '#series-template',
    props: ['items'],
  })

  Vue.component('teams', {
    template: '#teams-template',
    props: ['items'],
    data(){
      return {
        showTeamModal:false,
      }
    },
    methods: {
      createTeam: function() {
        this.showTeamModal = true;
      }
    }
  })

  var dashboard = new Vue({
    el: "#dashboard",
    data: {
      items: [],
      q:"",
      currentView: "users",
    },
    mounted: function(){
      this.getItems("users"); // default items
    },
    methods: {
      getItems: function(view){
        // When a model is changed, the view will be automatically updated.
        this.currentView = view;
        this.$http.get('/api/v1/admin/' + view + "?q=" + this.q).then((response) => {
          this.items = response.data;
          //console.log(response.data[0].leader.username);
        }, (response) => {
          // error callback
        });
      },
      isActive: function(isActive){
        return this.currentView == isActive ? "active" : "" ;
      },
      search:function(){
        this.getItems(this.currentView);
      }
    }
  })

})();
