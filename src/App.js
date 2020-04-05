import React, { Component } from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Landing from './components/Landing';

import ScrollToTop from './components/ScrollToTop';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Route exact path="/" component={ Landing } />
        </ScrollToTop>
      </BrowserRouter>
    )
  }

}

export default App;


