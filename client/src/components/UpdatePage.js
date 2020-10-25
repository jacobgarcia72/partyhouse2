

import {Component } from 'react';
import { withRouter } from 'react-router-dom';
import { games } from '../config/games';


class UpdatePage extends Component {
  componentDidMount() {
    this.setMetaData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
      this.setMetaData();
    }
  }

  setMetaData = () => {
    const url = this.props.location.pathname.split('/')[1];
    let metaData = {
      description: 'Free games to play with your friends!',
      title: 'Party House Games',
      image: 'logo.blue'
    };
    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      if (url === game.url) {
        metaData.description = `Play ${game.displayName} with your friends! ${game.description || ''}`;
        metaData.title = `${game.displayName} | Party House Games`;
        metaData.image = `thumbnails/${url}`;
        break;
      }
    };
    document.querySelectorAll('.meta-description').forEach(el => el.content = metaData.description);
    document.querySelector('.meta-title').content = metaData.title;
    document.getElementById('page-title').innerText = metaData.title;
    document.querySelector('.meta-image').content = `/assets/img/${metaData.image}.png`;
  }

  render() {
    return this.props.children
  }
}

export default withRouter(UpdatePage)