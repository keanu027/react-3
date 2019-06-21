import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import Header from './Header/Header';
import Compose from './Compose/Compose';
import Post from './Post/Post';


axios.defaults.headers.common['Content-Type'] = 'application/json';

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };

    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.createPost = this.createPost.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:9090/posts')
    .then(Response => { 
      this.setState({posts: Response.data})
    });
  }

  updatePost(id, text,date) {
    axios.put(`http://localhost:9090/posts/${id}`,{text,date})
    .then(Response =>{
      const newpost =Response.data;
      console.log(newpost);
      const new_post = this.state.posts.map(post =>{
        if(post.id === newpost.id){
          return { post,...newpost };
        } else {
          return post;
        }
      });
      this.setState({ posts: new_post });
    });
  }

  deletePost(id) {
  axios.delete(`http://localhost:9090/posts/${id}`)
  .then(Response => {
    this.setState({
      posts: this.state.posts.filter(post => post.id !== id),
    });
  });
}

  createPost(text) {
    axios.post(`http://localhost:9090/posts/`,{text})
    .then(Response =>{
      this.setState({ posts:[Response.data,...this.state.posts] })
    });
  }

  searchPost = (text) => {
  axios.get(`http://localhost:9090/posts?q=${encodeURI(text)}`)
  .then(Response =>{
    this.setState({
      posts: Response.data
    });
  });
  }
  render() {
    const { posts } = this.state;

    return (
      <div className="App__parent">
        <Header SearchPostFn={this.searchPost}/>

        <section className="App__content">
          <Compose createPostFn={this.createPost}/>
          {posts.map(post =>(
            <Post key={post.id} 
            text={post.text} 
            date={post.date}
            id={post.id}
            updatePostFn={this.updatePost}
            deletePostFn={this.deletePost}/>
          ))}
        </section>
      </div>
    );
  }
}

export default App;
