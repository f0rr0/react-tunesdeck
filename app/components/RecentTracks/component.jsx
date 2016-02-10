import React from 'react';
import Rebase from 're-base';
import TrackItem from './TrackItem/component.jsx';
import './style.css';

const base = Rebase.createClass('https://quantifiedself.firebaseio.com');

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
        let tracksUri = date.toString() + '/tracks';
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
      return null;
      console.log('Waiting for data');
    } else {
      const tracks = this.state.tracks.map((track) => {
        return (
        <TrackItem key={track.key} title={track.title} artist={track.artist} link= {track.link} thumbs={track.thumbs} timestamp={track.timestamp}></TrackItem>
        );
      });
      return (
        <div className='base'>
          <ul>
            {tracks}
          </ul>
        </div>
      );
    }
  }
}
