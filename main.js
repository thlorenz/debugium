'use strict';

var button = document.getElementById('click-me');
button.onclick = onclicked;

var silent = true;

function onclicked(e) {
  if (silent) return;
  console.log('clicked the click me button');
  console.log(e);
}
