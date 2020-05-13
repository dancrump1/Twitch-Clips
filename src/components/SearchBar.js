import React, {useState} from 'react';
import moment from 'moment';


function SearchBar({twitchClient}) {

    const [streamerValue, setStreamerValue] = useState("");
    const [gameValue, setGameValue] = useState("");
    const [streamerNameDisplay, setstreamerNameDisplay] = useState("");
    const [liveStatusValue, setLiveStatusValue] = useState("No probably idk search for someone you nitwit");
    const [startDateValue, setStartDateValue] = useState("");
    const [endDateValue, setEndDateValue] = useState("");
    const [createdByValue, setCreatedByValue] = useState("");
    const [listOfClips, setListOfClips] = useState([]);
    const [numberOfResults, setNumberOfResults] = useState(100);
  
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
    <div>
        <p>Use these to find {numberOfResults} results for {streamerValue || 'Fckin nobdy'} between {startDateValue || 'the beginning of time'} - {endDateValue || 'the end of time'}</p>
      <input type='text' value={streamerValue} onChange={ event => {setStreamerValue(event.target.value); setstreamerNameDisplay(''); setLiveStatusValue('No probably idk search for someone you nitwit') }} placeholder="Type here to search for a streamer's clips" className='streamerNameInput' />
      <input type='date' onChange={ event => setStartDateValue(event.target.value) } className='startDate' />
      <input type='date' onChange={ event => setEndDateValue(event.target.value) } className='endDate' />
      <input type='text' value={numberOfResults} onChange={event => setNumberOfResults(event.target.value)} />
      <p>User these to filter the list of 100 results</p>
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
)
}

export default SearchBar