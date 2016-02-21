import React from 'react'
import { Link } from 'react-router'

import LoginContainer from '../containers/LoginContainer'

const App = ({children}) => (
    <div>
       <LoginContainer />
       <Link to="/search">Search</Link>
       {children}
   </div>
)

export default App
