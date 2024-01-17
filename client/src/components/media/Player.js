import React, { useEffect, useState } from 'react';
import { gameMediaFiles } from './mediaFiles';

import {connect} from 'react-redux';
import './style.sass';

const Player = (props) => {

  const [videoPlayers, setVideoPlayers] = useState([]);
  const [musicPlayers, setMusicPlayers] = useState([]);
  const [audioPlayers, setAudioPlayers] = useState([]);

  useEffect(() => {
    loadFiles();
  }, [props.game]);

  useEffect(() => {
    let musicPlayer = document.getElementById(`music-${props.game.url}-${props.curMusic}`);
    if (musicPlayer) {
      musicPlayer.volume = props.volume / 20;
    }
    let audioPlayer = document.getElementById(`audio-${props.game.url}-${props.curAudio}`);
    if (audioPlayer) {
      audioPlayer.volume = props.volume / 10;
    }
  }, [props.volume]);

  useEffect(() => {
    Boolean(props.curVideo) && Boolean(videoPlayers) && playVid(props.curVideo);
  }, [props.curVideo, videoPlayers]);

  useEffect(() => {
    if (Boolean(musicPlayers) && Boolean(props.curMusic)) {
      const players = document.querySelectorAll('.music-player');
      players.forEach((p) => p.pause());
      let player = document.getElementById(`music-${props.game.url}-${props.curMusic}`);
      if (player) {
        player.volume = props.volume / 20;
        player.play();
      }
    }
  }, [props.curMusic, musicPlayers]);

  useEffect(() => {
    let player = document.getElementById(`audio-${props.game.url}-${props.curAudio}`);
    if (player) {
      player.volume = props.volume / 10;
      player.play();
    }
  }, [props.curAudio]);

  const playVid = (videoName) => {
    const players = document.querySelectorAll('.bg-video');
    players.forEach((p) => p.style.display = 'none');
    const player = document.getElementById(`vid-${props.game.url}-${videoName}`);
    if (player) {
      player.style.display = 'block';
      player.play();
    }
  }

  const loadFiles = () => {
    const { url } = props.game;
    const {video, music, audio} = gameMediaFiles[url];
    let needToLoad = video.length + music.length + audio.length;

    let vidPlayers = [];
    let musPlayers = [];
    let audPlayers = [];

    const finishLoadingFile = () => {
      needToLoad--;
      if (!needToLoad) {
        props.handleFinishLoading();
      }
    }


    video.forEach((file) => {
      vidPlayers.push(
        <video key={`${url}-${file}`} id={`vid-${url}-${file}`} style={{'display':'none'}} className="bg-video" loop muted playsInline onLoadedData={finishLoadingFile}>
          <source src={`/assets/video/${url}/${file}.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    });

    music.forEach(file => {
      musPlayers.push(
        <audio key={`${url}-${file}`} id={`music-${url}-${file}`} className="music-player" loop onLoadedData={finishLoadingFile}>
          <source src={`/assets/music/${url}/${file}.ogg`} type="audio/ogg" />
          <source src={`/assets/music/${url}/${file}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      )
    });

    audio.forEach(file => {
      audPlayers.push(
        <audio key={`${url}-${file}`} id={`audio-${url}-${file}`} className="audio-player" onLoadedData={finishLoadingFile} onEnded={handleFinishAudio}>
          <source src={`assets/audio/${url}/${file}.ogg`} type="audio/ogg" />
          <source src={`assets/audio/${url}/${file}.mp3`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>  
      )
    });
    setVideoPlayers(vidPlayers);
    setMusicPlayers(musPlayers);
    setAudioPlayers(audPlayers);
  }

  const handleFinishAudio = async ()=>{
    if (props.callback) {
      props.callback();
    }
  }

  return (
    <div className="media">
      <div className="video">
        {videoPlayers}
      </div>
      <div className="audio">
        {musicPlayers}
        {audioPlayers}
      </div>
    </div>
  );
};

function mapStateToProps({ curMusic, curVideo, game, volume }) {
  return { curMusic, curVideo, game, volume };
}

export default connect(mapStateToProps, null)(Player);