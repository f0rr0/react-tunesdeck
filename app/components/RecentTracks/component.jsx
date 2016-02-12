import React from 'react';
import Rebase from 're-base';
import TrackItem from './TrackItem/component.jsx';
import './style.css';

const base = Rebase.createClass('https://meapi.firebaseio.com');

export default class RecentTracks extends React.Component {

  constructor() {
    super();
    this.state = {
      tracks: null,
    };
  }

  init() {
    this.ref1 = undefined;
    this.ref2 = base.listenTo('lastDate', {
      context: this,
      then: (date) => {
        let tracksUri = date.toString() + '/recentTracks';
        this.ref1 = base.listenTo(tracksUri, {
          context: this,
          asArray: true,
          then: (tracks) => {
            this.setState({ tracks: tracks.slice(0, 5) });
          },
        });
      },
    });
  }

  componentWillMount() {
    this.init();
  }

  componentWillUnmount() {
    if (this.ref2) {
      base.removeBinding(this.ref2);
    }

    if (this.ref1) {
      base.removeBinding(this.ref1);
    }
  }

  render() {
    if (!this.state.tracks) {
      console.log('Waiting for data!');
      return (
        <div className='base'>
          <h3>Loading...</h3>
        </div>
      );
      console.log('Waiting for data');
    } else {
      const tracks = this.state.tracks.map((track) => {
        return (
        <TrackItem key={track.key} title={track.title} artist={track.artist} link= {track.link} thumbs={track.thumbs} timestamp={track.timestamp}></TrackItem>
        );
      });
      return (
        <div className='base'>
          <h3>My music in realtime</h3>
          <ul>
            {tracks}
          </ul>
        </div>
      );
    }
  }
}
