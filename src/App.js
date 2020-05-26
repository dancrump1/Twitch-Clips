import React, { useState } from 'react';
import TwitchClient from 'twitch';
import moment from 'moment';
import ImageGallery from 'react-image-gallery';

import './App.scss';

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
  const [numberOfResults, setNumberOfResults] = useState(5);

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
    const clips = await twitchClient.helix.clips.getClipsForBroadcaster(user.id, 
      { endDate: endDateValue ? moment(endDateValue).format() : undefined,
         startDate: startDateValue ? moment(startDateValue).format() : undefined,
          limit: createdByValue ? 100 : numberOfResults,
         });
    return clips;
  }

  async function fetchGameId() {
    const gameId = await twitchClient.helix.games.getGameByName(gameValue);
    return gameId;
  }

  const renderVideo = clip => {
    return (
      <div >
 <iframe
                  src={clip.embedUrl}
                  frameBorder='0'
                  allowFullScreen
                  title={clip.title}
                  className='iframe'
                />
      </div>
    )
  }


  return (
    <div className='pageContainer'>
      <form className='filterContainer'>
        <input type='text' value={streamerValue} onChange={ event => {setStreamerValue(event.target.value); setstreamerNameDisplay(''); setLiveStatusValue(false) }} placeholder="Type here to search for a streamer's clips" className='streamerNameInput' />
        <input type='date' onChange={ event => setStartDateValue(event.target.value) } className='startDate' />
        <input type='date' onChange={ event => setEndDateValue(event.target.value) } className='endDate' />
        <input type='text' value={ gameValue } onChange={ event => setGameValue(event.target.value) } placeholder="Filter by game" className='gameInput' />
        <input type='text' value={ createdByValue } onChange={ event => setCreatedByValue(event.target.value) } placeholder="Created By" className='createdByInput' />
        <p>Increasing this will cause some lag</p>
        <input type='text' value={numberOfResults} onChange={event => setNumberOfResults(event.target.value)} />   
        <button
          className='button' 
          type='submit'
          onClick={ (e) => {
            e.preventDefault();
            console.log('coming soon chat, relax');
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
              const mungedClips = filteredClips.map(clip => ({thumbnail: clip.thumbnailUrl, original: clip.url, embedUrl: clip.embedUrl, description: clip.title , renderItem: () => renderVideo(clip)}))
              return setListOfClips(mungedClips)
            })
            });
            
        } }
        >
          search
        </button>
        </form>
        
      <section className='galleryContainer'>       
          <ImageGallery showFullscreenButton={false} showPlayButton={false} items={listOfClips} />
      </section>
    </div>
  );
}

export default App;
