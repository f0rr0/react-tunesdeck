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
    };
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
      <ol style={styles.base}>
        {tracks}
      </ol>
    );
  }

  componentWillMount() {
    Tracks.bindToState('2016/02/04/tracks', {
      context: this,
      state: 'tracks',
      asArray: true
    });
  }

  componentDidMount() {
    console.log(styles);
  }
}
