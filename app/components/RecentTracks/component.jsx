import React from 'react';
import Rebase from 're-base';
import TrackItem from './TrackItem/component.jsx';
import FlipMove from 'react-flip-move';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style.css';
const base = Rebase.createClass('https://web-bot-e8aee.firebaseio.com');
export default class RecentTracks extends React.Component {
    constructor() {
        super();
        this.state = {
            tracks: null
        };
    }
    init() {
        this.ref = base.listenTo('recenttracks', {
            context: this,
            asArray: true,
            then: (allTracks) => {
                let cache = [];
                const tracks = allTracks.filter((track) => {
                    track.id = this.getTrackKey(track);
                    if (cache.indexOf(track.id) <= -1) {
                        cache.push(track.id);
                        return track;
                    }
                }).splice(0, 5);
                this.setState({tracks: tracks});
            }
        });
    }
    getTrackKey(track) {
        return (track.title + track.artist).replace(/ /g, '').toLowerCase();
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
                    <h3>Fetching tracks...</h3>
                </div>
            );
        } else {
            const tracks = this.state.tracks.map((track) => {
                if (track) {
                    return (
                        <ReactCSSTransitionGroup key={track.id} transitionName='base' component='li' transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                            <TrackItem key={track.id} title={track.title} artist={track.artist} link={track.link} thumbs={track.thumbs} timestamp={track.timestamp}></TrackItem>
                        </ReactCSSTransitionGroup>
                    );
                }
            });
            return (
                <div className='base'>
                    <FlipMove duration={500} delay={0} easing={'linear'} staggerDurationBy={0} staggerDelayBy={0} typeName='ul'>
                        {tracks}
                    </FlipMove>
                </div>
            );
        }
    }
}
