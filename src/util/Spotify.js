import { SearchBar } from "../Components/SearchBar/SearchBar";

let accessToken;
const clientId = "dd4de53d5d4642448d86d68791a7dcbc";
const redirect = "http://localhost:3000";

export let Spotify = {
    getAccessToken() {
        if(accessToken) {
            console.log('jfd;');
            return accessToken;
            
        };

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log('fjdkls;a')
            return accessToken
        } else {
            window.location = "https://accounts.spotify.com/authorize?client_id=dd4de53d5d4642448d86d68791a7dcbc&response_type=token&scope=playlist-modify-public&redirect_uri=http://localhost:3000"
            console.log('yada');
        }
        console.log('jfkdl;sa')
    },

    search (term) {
        const accessToken = Spotify.getAccessToken();
        console.log(accessToken);
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
            return [];
        };
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
        
    },
 
    savePlaylist(playlistName, uriArray) {
        if (!playlistName || !uriArray) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}` 
        };
        let userId;
        console.log(accessToken);
// you put the post request inside the get request because they're part of the
// same method and you can't return twice. I wasn't thinking you returned the fetch
// just returned the things inside the fetch. 
        return fetch ('https://api.spotify.com/v1/me', {headers: headers} 
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch (`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: "POST",
                body: JSON.stringify({
                    name: playlistName
                })
    
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                let playlistID = jsonResponse.id;
                return fetch (`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({
                        uris: uriArray
                    })
        
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    let playlistID = jsonResponse.id;
                });
            });
        });



    }
};

