import MemeGame from '../components/game/games/meme';
import HonestAnswers from '../components/game/games/answers';
import StoryTime from '../components/game/games/story-time';
import speakeasy from '../components/game/games/speakeasy';

export const games = [
  {
    displayName: 'Dank U',
    url: 'meme',
    minPlayers: 3,
    maxPlayers: 30,
    component: MemeGame,
    description: "Which of your friends is the ultimate meme master? Turn your photos into dank memes you can download and share!",
    partyMode: true,
    remoteMode: true,
    settings: {
      timers: [
        {
          name: 'Image',
          default: 100
        },
        {
          name: 'Caption',
          default: 200
        },
        {
          name: 'Vote',
          default: 50
        }
      ],
      checkboxes: [
        {
          name: 'allowUpload',
          text: 'Allow Uploads'
        }
      ]
    },
    public: true
  },
  {
    displayName: 'Story Time',
    url: 'story-time',
    minPlayers: 3,
    maxPlayers: 32,
    component: StoryTime,
    description: "There's no telling what hilarious stories will be told when all your friends have a say! Follow the prompts to tell hilarious narratives.",
    public: true
  },
  {
    displayName: 'Honest Answers',
    url: 'answers',
    minPlayers: 2,
    maxPlayers: 30,
    component: HonestAnswers,
    description: "Personal questions designed to get you and your friends talking.",
    public: true
  },
  {
    displayName: 'Draw The Line',
    url: 'draw-the-line',
    minPlayers: 3,
    maxPlayers: 30,
    component: null
  },
  {
    displayName: 'Pass The Art',
    url: 'pass-the-art',
    minPlayers: 3,
    maxPlayers: 30,
    component: null
  },
  {
    displayName: 'Speakeasy',
    url: 'speakeasy',
    minPlayers: 3,
    maxPlayers: 30,
    component: speakeasy
  }
];

export const getGameByUrl = url => games.find(game => game.url === url);
