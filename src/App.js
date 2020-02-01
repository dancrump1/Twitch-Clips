import React, {useState} from 'react';
import axios from 'axios';
import TwitchClient from 'twitch';
import './App.css';

function App() {
  const clientId = '21w5wlsrs2z97lckvfraznvflm33m3';
const clientSecret = 'lzci6s1dv7uucj4hb8ji2iw35c7y7g';
const twitchClient = TwitchClient.withClientCredentials(clientId, clientSecret);

const [inputValue, setInputValue] = useState("");

async function isStreamLive() {
	const user = await twitchClient.helix.users.getUserByName(inputValue);
	if (!user) {
    return false;
	}
	return await twitchClient.helix.streams.getStreamByUserId(user.id) !== null;
}

async function fetchClipLibrary() {
  const user = await twitchClient.helix.users.getUserByName(inputValue);
  if (!user) {
    return false;
	}
  const clips = await twitchClient.helix.clips.getClipsForBroadcaster(user.id, {});
	return clips;
}
 
return (
    <div>
      <input type='text' value={inputValue} onChange={event=> setInputValue(event.target.value)} placeholder="Type here to search for a streamer's clips" />
  <button onClick={()=>{
    console.log('coming soon chat, relax');
    console.log(isStreamLive())
    console.log(fetchClipLibrary().then(data=> console.log(data.data)))
//     fetch("https://www.twitch.tv/justlowfps/clips/PricklyImportantSushiBibleThump", {
//   headers: {
//     Accept: "application/vnd.twitchtv.v5+json",
//     "Client-Id": "21w5wlsrs2z97lckvfraznvflm33m3",
//   },
//   mode: 'no-cors'
// })
//       .then(response => {
//         return console.log(response);
      
     
//       });
  }
} 
  >something</button>
  {/* 
    STEPS TO SUCCESS
    1) Fetch data on click of button
    2) Have input update state and pass state to button to use as query param
    3) Put data in array, map over array into iframes
    4) Figure out how to download individual clip by clicking a button
    5) Download all button */}
    </div>
  );
}

export default App;
