import React, { useState } from 'react';
import TwitchClient from 'twitch';
import moment from 'moment';
import './App.css';

function App() {
  const clientId = '21w5wlsrs2z97lckvfraznvflm33m3';
  const clientSecret = 'lzci6s1dv7uucj4hb8ji2iw35c7y7g';
  const twitchClient = TwitchClient.withClientCredentials(clientId, clientSecret);

  const [streamerValue, setStreamerValue] = useState("");
  const [gameValue, setGameValue] = useState("");
  const [liveStatusValue, setLiveStatusValue] = useState("false probably idk search for someone you nitwit");
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  const [createdByValue, setCreatedByValue] = useState("");
  const [listOfClips, setListOfClips] = useState([]);

  async function isStreamLive() {
    const user = await twitchClient.helix.users.getUserByName(streamerValue);
    if (!user) {
      return false;
    }
    return await twitchClient.helix.streams.getStreamByUserId(user.id) !== null;
  }

  async function fetchClipLibrary() {
    const user = await twitchClient.helix.users.getUserByName(streamerValue);
    if (!user) {
      return false;
    }
    const clips = await twitchClient.helix.clips.getClipsForBroadcaster(user.id, { endDate: endDateValue ? moment(endDateValue).format() : undefined, startDate: startDateValue ? moment(startDateValue).format() : undefined, limit: "20" });
    return clips;
  }

  async function fetchGameId() {
    const gameId = await twitchClient.helix.games.getGameByName(gameValue);
    return gameId;
  }


  return (
    <div className={ 'searchContainer' }>
      <input type='text' value={ streamerValue } onChange={ event => setStreamerValue(event.target.value) } placeholder="Type here to search for a streamer's clips" />
      <input type='date' onChange={ event => setStartDateValue(event.target.value) } />
      <input type='date' onChange={ event => setEndDateValue(event.target.value) } />
      <input type='text' value={ gameValue } onChange={ event => setGameValue(event.target.value) } placeholder="Filter by game" />
      <input type='text' value={ createdByValue } onChange={ event => setCreatedByValue(event.target.value) } placeholder="Created By" />
      <div><strong>Are they live: </strong> { liveStatusValue }</div>
      <button
        className={ 'button' }
        onClick={ () => {
          console.log('coming soon chat, relax');
          isStreamLive().then(data => setLiveStatusValue(data.toString()));
          fetchGameId().then(gameId => {
            fetchClipLibrary().then(data => {
              const filteredClips = data.data.filter(clip => {
                if (createdByValue && gameId) {
                  return clip.gameId.toString() === gameId.id.toString() && clip.createdBy === createdByValue;
                } else if (!createdByValue && gameId) {
                  return clip.gameId.toString() === gameId.id.toString();
                } else if (!gameId && createdByValue) {
                 return clip.creatorDisplayName === createdByValue;
                } else {
                  return clip;
                }
              });
              console.log(filteredClips)
              return setListOfClips(filteredClips)
            });
          })
        } }
      >search</button>
      { !!listOfClips.length && listOfClips.map(clip => <div key={ clip.id }>{ clip.title }
        <iframe
          src={ clip.embedUrl }
          height="600px"
          width="100%"
          frameBorder="<frameborder>"
          scrolling="<scrolling>"
          title="Iframe1">

        </iframe>
      </div>) }
    </div>
  );
}

export default App;
