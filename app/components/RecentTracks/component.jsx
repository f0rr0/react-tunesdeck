import React from 'react';
import Rebase from 're-base';
import Radium from 'radium';
import styles from './style.css';

const Tracks = Rebase.createClass('https://quantifiedself.firebaseio.com');

@Radium
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      today: ''
    };
    Rebase.listenTo('lastDate', {
      context: this,
      then: (date) => {
        this.setState({ today: date });
      }
    });
  }

  render() {
    const tracks = this.state.tracks.map((track) => {
      return (
        <li key={track.key}>
        {track.title} by {track.artist}
        </li>
      )
    });
    return (
      <div style={styles.base}>
        <h6>{this.state.today}</h6>
        <ol>
          {tracks}
        </ol>
      </div>
    );
  }

  componentDidMount() {
    Tracks.bindToState(this.state.today, {
      context: this,
      state: 'tracks',
      asArray: true
    });
    console.log(styles);
  }
}
