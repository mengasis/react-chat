import React, { Component } from 'react'

import { Wrapper } from './components/Wrapper'
import CommentsContainer from './containers/CommentsContainer'

class App extends Component {
	render() {
		return (
			<Wrapper className="App">
				<CommentsContainer />
			</Wrapper>
		)
	}
}

export default App
