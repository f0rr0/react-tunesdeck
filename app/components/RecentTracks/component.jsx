import React from 'react';
import Rebase from 're-base';
import Radium from 'radium';
import styles from './style.css';

const base = Rebase.createClass('https://quantifiedself.firebaseio.com');

@Radium
export default class RecentTracks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      uri: '',
      today: ''
    };
  }

  render() {
    const tracks = this.state.tracks.map((track) => {
      return (
        <li key={track.key}>
          <a href={track.link}>{track.title} by {track.artist}</a>
        </li>
      )
    });
    return (
      <div style={styles['.base']}>
        <p>{this.state.today}: Most recent tracks in real time</p>
        <ol>
          {tracks}
        </ol>
      </div>
    );
  }

  componentDidMount() {
    base.listenTo('lastDate', {
      context: this,
      then: (date) => {
        let tracksUri = date.toString()+'/tracks';
        this.setState({ today: date, uri: tracksUri });
        base.bindToState(this.state.uri, {
          context: this,
          state: 'tracks',
          asArray: true
        });
      }
    });
    console.log(styles);
  }
}
