const getAudio = (game) => {

    let audio = [];

    const addFiles = (folder, from, through) => {
        if (through || through === 0) {
            for (let i = from; i <= through; i++) {
                audio.push(`${folder}/${i}`);
            }
        } else {
            audio.push(`${folder}/${from}`);
        }
    }

    if (game === 'meme'){
        addFiles('intro', 0);
        addFiles('upload', 0);
        addFiles('caption', 0);
        addFiles('vote', 0);
        addFiles('bonus', 0);
    }
    return audio;
}

export const gameMediaFiles = {
    meme: {
      video: ['intro','upload','caption','vote'],
      music: ['lobby','main','upload', 'caption'],
      audio: getAudio('meme')
    }
}