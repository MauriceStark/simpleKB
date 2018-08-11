Vue.filter('dateFromNow', (value) => {
  return moment(Date.parse(value)).locale('es').fromNow();
});

Vue.filter('dateFormat', (value) => {
  return moment(Date.parse(value)).locale('es').format("ll");
});
