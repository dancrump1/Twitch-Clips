import React, { useState } from 'react';
import TwitchClient from 'twitch';
import moment from 'moment';
import twitchGif from './images/twitch_logo_animation.gif'
import online from './images/online.png'
import offline from './images/offline.png'
import greyCircle from './images/greyCircle.png'
import './App.scss';
import { SearchBar } from './components';

function App() {
  const clientId = '21w5wlsrs2z97lckvfraznvflm33m3';
  const clientSecret = 'lzci6s1dv7uucj4hb8ji2iw35c7y7g';
  const twitchClient = TwitchClient.withClientCredentials(clientId, clientSecret);

  const [streamerValue, setStreamerValue] = useState("");
  const [gameValue, setGameValue] = useState("");
  const [streamerNameDisplay, setstreamerNameDisplay] = useState("");
  const [liveStatusValue, setLiveStatusValue] = useState(false);
  const [startDateValue, setStartDateValue] = useState("");
  const [endDateValue, setEndDateValue] = useState("");
  const [createdByValue, setCreatedByValue] = useState("");
  const [listOfClips, setListOfClips] = useState([]);
  const [numberOfResults, setNumberOfResults] = useState(25);

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
    const clips = await twitchClient.helix.clips.getClipsForBroadcaster(user.id, { endDate: endDateValue ? moment(endDateValue).format() : undefined, startDate: startDateValue ? moment(startDateValue).format() : undefined, limit: "100" });
    return clips;
  }

  async function fetchGameId() {
    const gameId = await twitchClient.helix.games.getGameByName(gameValue);
    return gameId;
  }


  return (
    <div className='pageContainer'>
       <div>
      <input type='text' value={streamerValue} onChange={ event => {setStreamerValue(event.target.value); setstreamerNameDisplay(''); setLiveStatusValue(false) }} placeholder="Type here to search for a streamer's clips" className='streamerNameInput' />
      <input type='date' onChange={ event => setStartDateValue(event.target.value) } className='startDate' />
      <input type='date' onChange={ event => setEndDateValue(event.target.value) } className='endDate' />
      <input type='text' value={numberOfResults} onChange={event => setNumberOfResults(event.target.value)} />
      <p>User these to filter the list of 25 results</p>
      <input type='text' value={ gameValue } onChange={ event => setGameValue(event.target.value) } placeholder="Filter by game" className='gameInput' />
      <input type='text' value={ createdByValue } onChange={ event => setCreatedByValue(event.target.value) } placeholder="Created By" className='createdByInput' />
      <button
        className={ 'button' }
        onClick={ () => {
          console.log('coming soon chat, relax');
          setstreamerNameDisplay(streamerValue);
          isStreamLive().then(data => setLiveStatusValue(data));
          fetchGameId().then(gameId => {
            fetchClipLibrary().then(data => {
              const filteredClips = data?.data?.filter(clip => {
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
        </div>
        <div className="nameAndStatusContainer">

        <h1>{`${streamerNameDisplay || 'Type to search'} ${liveStatusValue ? "online" : "offline"}`  || 'Search from a user...'}</h1>
        </div>
      <div className='iframeGrid'>
        { !!listOfClips?.length && listOfClips.map(clip =>
          <div className="iframeContainer" key={ clip.id }>
            <div className='title'>
              { clip.title }
            </div>
            <iframe
              src={ clip.embedUrl + '&autoplay=false'  }
              frameBorder="<frameborder>"
              scrolling="<scrolling>"
              title="Iframe1"
              className='iframe'
            />
          </div>
        ) }
        {/* {!listOfClips?.length && 
        <>
        <h1 className='searchMessage'>
          Search for a Streamer's clips
        </h1>
        <img src={twitchGif} alt="twitch" className='twitchGif' />
        </>
        } */}
      </div>
    </div>
  );
}

export default App;
