import state from '../modules/state' ;

// events
const addEventListeners = el => {
  var links = el.querySelectorAll('a');
  [...links].forEach(link =>
    link.addEventListener('click', function(e) {
      e.preventDefault();
      history.pushState(null, null, link.href);
      state();
      console.log('clicked link', link);
    })
  );
};

export default addEventListeners;
