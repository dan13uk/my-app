import React, { Component } from 'react';
import './App.css';
import Comment from './Comment';
import FaUser from 'react-icons/lib/fa/user'
import registerServiceWorker from './registerServiceWorker'

class App extends Component {
  constructor(props) {
    super(props)
    this.state= {
      comments: [],
      link:""

    }
    this.eachComment = this.eachComment.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentWillMount() {
    var self = this
    
  
      fetch('http://jsonplaceholder.typicode.com/comments?_page=1&_limit=20')
      .then(function (response){
        self.setState({link:response.headers.get("link")})
        return response
      })
      .then(response => response.json())
      .then(json => json.forEach( el => self.add(el)))
      
      
    
  }


  add(text){
    this.setState(prevState => ({
      comments: [
        ...prevState.comments,
        {
          postID: text.postId,
          id: text.id,
          name: text.name,
          email: text.email,
          body: text.body
        }
      ]

    }))
  }

  loadMore(){
    var self = this
    var state = this.state.link;
    var parse = require('parse-link-header');
    var parsed = parse(state);
    console.log(parsed.next);
    if(parsed.next){
      
      fetch(parsed.next.url)
      .then(function (response){
        self.setState({link:response.headers.get("link")})
        return response
      })
      .then(response => response.json())
      .then(json => json.forEach( el => self.add(el)))
    }
    else{
      console.log('n')
    }

  }

  eachComment(comment, i) {
    return (
        <Comment key={i} index={i}>
          <div className="indComment">
            <div className="userInfo">
              <div className="usrIcon"><FaUser /></div>
                <div className="userDetails">
                  <span className="userName"><strong>{comment.name}</strong></span>
                  <span className="userEmail">{comment.email}</span>
                </div>
              </div>
            <div className="userComment">
              <span>{comment.body}</span>
            </div>
            
          </div>

        </Comment>
      )
  }

  render() {
    console.log(this.state)
    return (
      <div className="App">
        
        <div className="board">
          {this.state.comments.map(this.eachComment)}
        </div>
        <div className="loadMoreButtonContainer"><button onClick={this.loadMore}>Load more</button></div>
      </div>
    );
  }
}

export default App;
