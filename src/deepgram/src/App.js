import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


class App extends Component {

  constructor(props) {
    
    super(props);

    const httpConfigs = {
      auth: {
        username: 'recruiting',
        password: 'recruiting'
      }
    };

    this.state = {
      rows:[],
      assets: [],
      n_results: 0,
      n_pages: 0, 
      encodedUri: "",
      httpConfigs: httpConfigs,
      currentPage: 1
    }

    //bind helpers to maintain context
    this.getAssets = this.getAssets.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
  }

  //TODO: validating input types using PropTypes to make sure appropriate data types are set.

  componentDidMount(){
    //get the data using static uri
    
    let uri = window.encodeURI('https://secret-brain.deepgram.com/assets?npp=10&p=0');
    this.setState({encodedUri: uri});
    this.getAssets(uri, this.state.httpConfigs);
  }

  getAssets(uri,configs){
    return axios.get(uri, configs)
      .then(res =>{
        console.log(res.data)
        //take res.data, set this.state.results to data.results
        this.setState({n_results: res.data.n_results});
        this.setState({n_pages: res.data.n_pages});
        this.setState({assets: res.data.results});
        let tempRows = this.state.assets.map(asset =>{
          return <tr key={asset.asset_id}><td>{asset.asset_id}</td><td>{asset.created}</td><td>{asset.duration}</td></tr>;
        })   
        this.setState({rows: tempRows});
      }).catch(function(err){
        console.log(err)
      })
  };

  getNextPage(){
    //increment this.state.currentPage
    let currentPage = this.state.currentPage;
    if(currentPage < this.state.n_pages){
      console.log("WE INCREMENTED");
      this.setState({ currentPage: currentPage + 1 })
    }
    //encode the uri
    //call getAssets with the new URI

    let uri = window.encodeURI('https://secret-brain.deepgram.com/assets?npp=10&p='+this.state.currentPage);
    this.setState({encodedUri: uri});
    this.getAssets(uri, this.state.httpConfigs);
  }

  getPreviousPage(){
    //decrement this.state.currentPage
    let currentPage = this.state.currentPage;
    if(this.state.currentPage > 1){
      this.setState({ currentPage: currentPage - 1 });
    }
    
    //encode the uri
    //call getAssets with the new URI
    let uri = window.encodeURI('https://secret-brain.deepgram.com/assets?npp=10&p='+this.state.currentPage);
    this.setState({encodedUri: uri});
    this.getAssets(uri, this.state.httpConfigs);
  }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Deepgram Asset</h2>
        </div>

        <table>
        <thead>
          <tr>
            <th>Asset Id</th>
            <th>Duration</th>
            <th>Created</th>
          </tr>
        </thead>
          <tbody>
            {this.state.rows}
          </tbody>
        </table>
        <div className="paginator">
          <button onClick={this.getPreviousPage}>Back</button>
          <div>Page Count: {this.state.n_pages}</div>
          <button onClick={this.getNextPage}>Forward</button>
      </div>
      </div>
    );
  }
}

export default App;
