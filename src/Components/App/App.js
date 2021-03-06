

import React from 'react';
import './App.css';
import  {SearchBar}  from "../SearchBar/SearchBar.js";
import { SearchResults } from '../SearchResults/SearchResults.js';
import { Playlist } from '../Playlist/Playlist';
import {Spotify} from '../../util/Spotify';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {searchResults: [],
      playlistName: '',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  };

  addTrack (track) {
    let tracks = this.state.playlistTracks;
    
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    };   
      tracks.push(track);
      this.setState({playlistTracks: tracks});
      
  }

  removeTrack (track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);

    // for (let i = 0; i < this.playlistTracks.length; i++) {
    //   if (track.id === this.playlistTracks[i].id) {
    //     tracks.splice(i, 1);
    //     this.setState({playlistTracks: tracks});
    //   }
    // };

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  };

  savePlaylist() {
    const trackUri = this.state.playlistTracks.map(track => track.uri);

    Spotify.savePlaylist(this.state.playlistName, trackUri).then(() => {
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      });
    });

    
  }

  search(search) {
    Spotify.search(search).then(searchResults => {
      this.setState({searchResults: searchResults})
    });
  }

  render () {
  return (
<div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch={this.search}/>
    <div className="App-playlist">
      <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
      <Playlist  onSave={this.savePlaylist} onNameChange={this.updatePlaylistName} onRemove={this.removeTrack} playlistTracks={this.state.playlistTracks} playlistName={this.state.playlistName}/>
    </div>
  </div>
</div>
  )
  }
};

export default App;
