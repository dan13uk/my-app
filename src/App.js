import React, { Component } from 'react';
import './App.css';
import Comment from './Comment';
import FaUser from 'react-icons/lib/fa/user'
import registerServiceWorker from './registerServiceWorker'

class App extends Component {
  constructor(props) {
    super(props)
    this.state= {
      comments: [],//array to save comments from the JSON object
      link:""//track the next URL to load more comments
    }
    this.eachComment = this.eachComment.bind(this)
    this.loadMore = this.loadMore.bind(this)
  }

  componentWillMount() {
    var self = this
    
  
      fetch('http://jsonplaceholder.typicode.com/comments?_page=1&_limit=20')
      .then(function (response){
        self.setState({link:response.headers.get("link")})//set the state of link. by getting the next link from the header response
        return response //return the repsonse
      })
      .then(response => response.json())
      .then(json => json.forEach( el => self.add(el)))//loop through and call the add method on each node
      
      
    
  }


  add(text){
    this.setState(prevState => ({
      comments: [
        ...prevState.comments,//previous state
        {
          postID: text.postId,//add the new comments
          id: text.id,
          name: text.name,
          email: text.email,
          body: text.body
        }
      ]

    }))
  }

  loadMore(){//loads more comments
    var self = this
    var state = this.state.link;
    var parse = require('parse-link-header');//using parse header package found here https://www.npmjs.com/package/parse-link-header
    var parsed = parse(state);
    console.log(parsed.next);
    if(parsed.next){//check if theres any next link ref
      
      fetch(parsed.next.url)//if there is fetch 
      .then(function (response){
        self.setState({link:response.headers.get("link")})//set the new next link to state
        return response
      })
      .then(response => response.json())
      .then(json => json.forEach( el => self.add(el)))//add next set of comments to state
    }
    else{//if there no next link do something
      console.log('no next link')
    }

  }

  eachComment(comment, i) {//comment template
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
