(function() {
  Vue.config.devtools = true;

  var params = new URLSearchParams(location.search.substr(1));

  var app = new Vue({
    el: '#home',
    data: {
      results: {
        objects:[]
      },
      url: '/api/v1/solutions/',
      q: params.get("q") || "",
      type: params.get("type") || "",
      tag: params.get("tag") || "",
      user: {}
    },
    methods: {
      search: function(param, event){

        if(param == "type") {
          this.type = event.target.value;
          params.set('type', this.type);
        }

        if(param == "tag") {
          this.tag = event.target.innerHTML;
          params.set('tag', this.tag);
        }

        params.set('q', this.q);

        if (this.tag) params.set('tag', this.tag);

        window.history.replaceState({}, '', `${location.pathname}?${params}`);

        this.$http.get(this.url + "?" + params.toString()).then((response) => {
          this.results = response.data;
        }, (response) => {

        });
      },
    },
    mounted: function(){
      // ====================================================================================================================
      //
      // ====================================================================================================================
      this.search();

      this.$http.get('/api/v1/user/teams').then((response) => {
        this.user =  response.data;
      }, (response) => {

      });

    }
  })
})();
