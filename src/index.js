import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Home from './views/home'
import Page from './views/page'
import Page1 from './views/page1'
import NotFound from './views/not-found'
import Subiendo from './views/subiendo'
import Cargando from './views/cargando'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Home} exact path="/" />
        <Route component={Page} exact path="/page" />
        <Route component={Page1} exact path="/page1" />
        <Route component={Subiendo} exact path="/subiendo" />
        <Route component={Cargando} exact path="/cargando" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
