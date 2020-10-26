import React from 'react';
import './style.sass';

export default props => {
  const { game, playCounts, abbreviated } = props;
  const { displayName, url, description, minPlayers, maxPlayers } = game;
  let playCount;
  if (playCounts && (playCounts[url] || playCounts[url] === 0)) {
    playCount = playCounts[url];
  }
  const playerCaption = abbreviated ? `${minPlayers}-${maxPlayers}` : `${minPlayers} - ${maxPlayers} Players`
  const playCountCaption = abbreviated ? playCount : `Played ${playCount} ${playCount === 1 ? 'Time' : 'Times'}`;
  return (
    <div className="game-card column">
      <img alt={displayName} src={`/assets/img/thumbnails/${url}.png`} className="thumbnail" />
      <div className="row game-stats">
        <div><i className="fas fa-user-friends"></i>&nbsp;{playerCaption}</div>
        {playCount ? <div><i className="fas fa-play"></i>&nbsp;{playCountCaption}</div> : null}
      </div>
      <div className="description">{description}</div>
    </div>
  );
}
