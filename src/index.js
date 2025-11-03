import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Recom from './views/recom'
import Dashboard from './views/dashboard'
import Landing from './views/landing'
import Subiendo from './views/subiendo'
import Cargando from './views/cargando'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Recom} exact path="/recomendaciones" />
        <Route component={Dashboard} exact path="/dashboard" />
        <Route component={Landing} exact path="/" />
        <Route component={Subiendo} exact path="/subiendo" />
        <Route component={Cargando} exact path="/cargando" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
