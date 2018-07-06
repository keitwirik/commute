import Commute from '../modules/commuteRouter';

window.addEventListener('popstate', function(e) {
  state();
});

function state() {
  console.log('state updated ', window.location);
  Commute.navigate(window.location.pathname);
}

export default state;
