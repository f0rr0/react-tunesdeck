import React from 'react';
import Rebase from 're-base';
import TimeStamp from './../TimeStamp/component.jsx';
import './style.css';

const base = Rebase.createClass('https://quantifiedself.firebaseio.com');

export default class RecentTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      uri: '',
      today: ''
    };
    base.listenTo('lastDate', {
      context: this,
      then: (date) => {
        let tracksUri = date.toString() + '/tracks';
        this.setState({today: date, uri: tracksUri});
        base.bindToState(this.state.uri, {
          context: this,
          state: 'tracks',
          asArray: true
        });
      }
    });
  }

  render() {
    const tracks = this.state.tracks.map((track) => {
      return (
        <li key={track.key}>
          <a href={track.link}>{track.title}&nbsp;by&nbsp;{track.artist}</a>&nbsp;<TimeStamp timestamp={track.timestamp} />
        </li>
      )
    });
    return (
      <div className='base'>
        <p>{this.state.today}: Most recent tracks in real time</p>
        <ol>
          {tracks}
        </ol>
      </div>
    );
  }
}
