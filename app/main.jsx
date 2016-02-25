import React from 'react';
import ReactDOM from 'react-dom';
import RecentTracks from './components/RecentTracks/component.jsx';

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <article
          className='base'
          style={{ width: 432, backgroundColor: '#4CAB3D', margin: 'auto' }}
        >
          Tracks are being scrobbled from Spotify, YouTube, SoundCloud and pretty much every other major music streaming service. A Google Apps script polls Last.fm every minute and logs the tracks to a Firebase database. This React component watches that database and renders the five most recent tracks.<br /><br/><a href='https://github.com/sidjain26/react-tunesdeck' style={{ color: '#FFFAFA' }}>View on Github</a>
        </article>
        <RecentTracks/>
      </div>
    );
  }
}
function run() {
  ReactDOM.render(<App/>, document.getElementById('root'));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
