import React from 'react';
import Ago from 'react-timeago';
export default class TimeStamp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    {
      return (() => {
        if(this.props.timestamp.nowplaying) {
          return <span>is playing</span>;
        }
        else {
        return <Ago date={this.props.timestamp.uts*1000}></Ago>
        }
      }
      )();
    }
}
}
