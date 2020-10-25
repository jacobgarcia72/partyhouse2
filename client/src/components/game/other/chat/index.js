import React, {Component} from 'react';
import {connect} from 'react-redux';
import './style.sass';
import TextArea from '../text-area';
import { postChat } from '../../../../functions';

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showChat: false,
      atBottom: true,
      text: '',
      unreadCount: 0,
      latestMessage: null
    };
    this.latestMessageInterval = null;
  }

  componentDidMount() {
    this.setState({unreadCount: (this.props.chat || []).length});
  }

  componentWillUnmount() {
    clearInterval(this.latestMessageInterval);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps && prevProps.chat) {
      const { chat } = this.props;
      const newChats = chat.length - prevProps.chat.length;
      if (newChats) {
        const { showChat, atBottom, unreadCount } = this.state;
        if (showChat && atBottom) {
            this.scrollToBottom();
        } else {
          const latestMessage = chat[chat.length - 1];
          this.setState({unreadCount: unreadCount + newChats, latestMessage});
          clearInterval(this.latestMessageInterval);
          this.latestMessageInterval = setTimeout(() => {
            this.setState({latestMessage: null});
          }, 2000);
        }
      }
    }
  }

  updateText = text=> {
    this.setState({text});
  }

  submitMessage = () => {
    postChat(this.props.code, this.props.playerIndex, this.state.text);
    this.scrollToBottom();
  }

  toggleChat = () => {
    const showChat = !this.state.showChat;
    this.setState({showChat, unreadCount: 0 }, () => {
      if (showChat) {
        this.scrollToBottom();
      }
      document.body.style.overflow = showChat ? 'hidden' : 'auto';
    });
  }

  onScroll = e => {
    const { scrollHeight, offsetHeight, scrollTop } = e.target;
    const scrollBottom = scrollHeight - offsetHeight;
    const atBottom = scrollTop >= scrollBottom - 10;
    this.setState({atBottom});
    if (atBottom) {
      this.setState({ unreadCount: 0 });
    }
  }

  scrollToBottom = () => {
    const el = document.getElementById('chat-posts');
    if (!el) return;
    const { scrollHeight, offsetHeight } = el;
    const scrollBottom = scrollHeight - offsetHeight;
    el.scrollTo(0, scrollBottom);
    this.setState({atBottom: true});
  }

  renderChat = () => {
    const chat = this.props.chat || [];
    return (
      <div>
        <div id="chat-posts" className="column chat-posts" onScroll={this.onScroll}>
          {chat.map((post, i) => (
            <div key={i} className="chat-post">
              <div className="chat-name">{post.name}</div>
              <div className="chat-message">{post.message}</div>
            </div>
          ))}
        </div>
        {this.state.unreadCount ? (
          <div className="new-messages">
            <div className="new-messages-btn" onClick={this.scrollToBottom}>
              New Messages <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        ) : null}
        <TextArea maxLength={120} placeholder={'Type message and press Enter to chat.'}
          onChange={this.updateText} onEnter={this.submitMessage}/>
      </div>
    )
  }

  render() {
    const { unreadCount, latestMessage, showChat } = this.state;
    return (
      <React.Fragment>
        {showChat ? (
        <div className="chat-list column">
          {this.renderChat()}
        </div>
        ) : null}
        <div className="chat" onClick={this.toggleChat}>
          <i className="fas fa-comment-dots"></i>
          <div className={`counter ${unreadCount ? 'highlight' : 'no-highlight'}`}>
            {unreadCount}
          </div>
        </div>
        {latestMessage && !showChat ? <div className="message-popup" onClick={this.toggleChat}>
          <div className="chat-name">{latestMessage.name}</div>
          <div className="chat-message">{latestMessage.message}</div>
        </div> : null}
      </React.Fragment>
    )
  }
}

function mapStateToProps({ chat, code, playerIndex }) {
  return { chat, code, playerIndex };
}

export default connect(mapStateToProps, null)(Chat);
