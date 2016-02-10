import React, {PropTypes} from 'react';
import TimeStamp from './TimeStamp/component.jsx';

export default class TrackItem extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    thumbalt: PropTypes.string,
    thumbs: PropTypes.object.isRequired,
    timestamp: PropTypes.object.isRequired,
  };
  static defaultProps = {
    title: '-',
    artist: '-',
    link: null,
    thumbalt: null,
    thumbs: null,
    timestamp: null,
  };

  render() {
    const { title, artist, timestamp, link } = this.props;
    const thumb = {
      backgroundImage: 'url(' + (this.props.thumbs.alt ? this.props.thumbs.alt : this.props.thumbs.yt) + ')',
    };

    return (
      <li className='track'>
        <div className='thumb' style={thumb}></div>
        <a href={link}>
          <span className='title'>{title}</span>
          <span className='artist'>{artist}</span>
        </a>
        <TimeStamp className='timestamp' timestamp={timestamp} />
      </li>
    );
  }
}
