
import  React, {Component} from 'react';
import { connect } from 'react-redux';
import { sendInput } from '../../../../functions';
import { renderMeme } from './helpers';
import Title from './Title';

class Vote extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animation: 1,
      votesReceived: 0, // votes received this round 
      points: [0,0], // points awarded to left meme and right meme, changes each round
      dankestMeme: null,  // meme index of the winner of the dankest meme bonus round
      sortedMemes: [], // memes sorted by votes
      voted: false
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.gameState || this.props.gameState.round > prevProps.gameState.round) {
      window.scrollTo(0, 0);
      this.setState({voted: false});
      if (this.props.gameState.bonusRound) {
        this.setState({ animation: 2 });
      }
    } else if (!prevProps.gameState || this.props.gameState.showStats !== prevProps.gameState.showStats) {
      window.scrollTo(0, 0);
    }
  }

  vote = memeIndex => {
    const { code, playerIndex } = this.props;
    sendInput(code, playerIndex, memeIndex);
    this.setState({voted: true});
  }

  renderVotingTokens = () => {
    if (this.state.voted) {
      return <h2>Vote cast. Waiting for other players.</h2>
    }
    const {pairs, round} = this.props.gameState;
    return (
      <div className="voting-tokens">
        <h2>Vote:</h2>
        <div className="row buttons">
          <button type="submit" onClick={()=> this.vote(pairs[round][0])}>First Meme</button>
          <button type="submit" onClick={()=> this.vote(pairs[round][1])}>Second Meme</button>
        </div>
      </div>
    )
  }

  renderMemes = ()=> {
    const {memes, pairs, round, showStats} = this.props.gameState;
    let renderedMemes = pairs[round].map((index, i)=>{
      const meme = memes.find(m => m.index === index);
      return <div className="meme-container" key={i}>
        {renderMeme(meme, i)}
        {showStats && this.renderStats(meme)}
      </div>
    });
    return <div id="memes">{renderedMemes}</div>
  }
  
  renderStats = meme => {
    const {gameState} = this.props;
    const {memes, pairs, round} = gameState;
    const totalVotes = memes.find(m => m.index === pairs[round][0]).votes + memes.find(m => m.index === pairs[round][1]).votes;
    const percent = Math.round(meme.votes / totalVotes * 100);
    return <div className="stat">
      <div className="impact large-font percent">{`${percent}%`}</div>
      <div className="credit">{`Image: ${meme.uploaderName}`}</div>
      <div className="credit">{`Caption: ${meme.captionerName}`}</div>
    </div>;
  }

  render() {
    const { animation } = this.state;
    const { showStats } = this.props.gameState;
    if (animation === 1) {
      return <Title lines={['Step 3:', 'Vote']} callback={()=> this.setState({animation: null})} />
    } else if (animation === 2) {
      return <Title lines={['Bonus Round:', 'Dankest Meme']} callback={()=> this.setState({animation: null})} />
    } else {
      return <div className="Meme Vote">
        {this.renderMemes()}
        {!showStats && this.renderVotingTokens()}
      </div>
    }
  }
}

function mapStateToProps({ gameState, playerIndex, code, players }) {
  return { gameState, playerIndex, code, players };
}

export default connect(mapStateToProps, null)(Vote);


