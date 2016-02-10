import React from 'react';
import ReactDOM from 'react-dom';
import RecentTracks from './components/RecentTracks/component.jsx';

function run() {
  ReactDOM.render(<RecentTracks/>, document.getElementById('root'));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
