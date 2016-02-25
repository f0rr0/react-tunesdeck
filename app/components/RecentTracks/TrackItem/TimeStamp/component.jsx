import React from 'react';
import Ago from 'react-timeago';
import './style.css';

class Equalizer extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className={this.props.className}>
        <div className='equaliser-container'>
          <ol className='equaliser-column'>
            <li className='colour-bar'></li>
          </ol>
          <ol className='equaliser-column'>
            <li className='colour-bar'></li>
          </ol>
          <ol className='equaliser-column'>
            <li className='colour-bar'></li>
          </ol>
          <ol className='equaliser-column'>
            <li className='colour-bar'></li>
          </ol>
          <ol className='equaliser-column'>
            <li className='colour-bar'></li>
          </ol>
        </div>
      </div>
    );
  }
}

export default class TimeStamp extends React.Component {
  constructor() {
    super();
  }

  render() {
    {
      return (() => {
        if (this.props.timestamp.nowplaying) {
          return <Equalizer className={this.props.className} />;
        } else {
          return (
            <Ago
              className={this.props.className}
              date={this.props.timestamp.uts * 1000}
            />
          );
        }
      }
      )();
    }
  }
}
