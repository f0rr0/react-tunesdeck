import React from 'react';
import Ago from 'react-timeago';

export default class TimeStamp extends React.Component {
  constructor() {
    super();
  }

  render() {
    {
      return (() => {
        if (this.props.timestamp.nowplaying) {
          return <span className={this.props.className}>is playing</span>;
        } else {
          return <Ago className={this.props.className} date={this.props.timestamp.uts * 1000}></Ago>;
        }
      }
      )();
    }
  }
}
