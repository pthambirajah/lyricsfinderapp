import React,{ useState,useEffect  } from 'react';
import { ActivityIndicator, StyleSheet, Text,TextInput, View, FlatList, Button, Share, ScrollView } from 'react-native';
import axios from 'axios';

export default function HomeScreen() {
  const apiKey = "898d4bbcbae5002db9a10ce43f0bacbb";
  const [songName, setSongName] = useState('');
  const [songDummy, setSongDummy] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [foundSongs, setFoundSongs] = useState('');
  const BLUE = "#428AF8"; //I wanted to reuse this blue but I use it only once
  

  //This is a workaround to one of my problem
  //I have to fetch the data twice to make it appear
  //So I load it as soon as the app is open for the first time, so the user doesnt see the bug.
  useEffect(() => {
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&s_track_rating=desc&apikey=${apiKey}`);
    setSongDummy(result.data.message.body.track_list);
    }
    fetchData();
  }, [songDummy]);

    //Here I simply get the 3 best rated songs that match the song name entered.
    //In case there is multiple same song, the user could select the right one.
    const getSong = () => {
    fetch(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&f_has_lyrics&s_track_rating=desc&apikey=${apiKey}`)
    .then(response=> response.json())
    .then(data => setFoundSongs(data.message.body.track_list))
    .catch((error) => { 
      Alert.alert('Error', error);
     });
     //Loading false allows me to display the buttons
     setIsLoading(false); 
    }

    //This function receive the track ID and get the lyrics of the song
    const getSongLyrics = (trackID) => {
      async function fetchLyrics() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackID}&apikey=${apiKey}`);
      setLyrics(result.data.message.body.lyrics.lyrics_body);
    }
    fetchLyrics();
    }

    //This allows user to share the lyrics with someone using native sharing option.
    const onShare = async () => {
        try {
          const result = await Share.share({
            message: lyrics,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

    //Here I render the button that display the song name and artist
    //On press it will load the lyrics
    const renderItem = ({ item }) => {  
      return (
        <Button
          title={item.track.track_name +" - "+ item.track.artist_name}
          onPress={() => getSongLyrics(item.track.track_id)}
        />
      );
    };

  return (
    <View style={styles.container}>
      <View style={{flex:3}}>
        <Text style={styles.title}>Find lyrics of your favourite song</Text>
        <TextInput
        style={styles.input}
          selectionColor={BLUE} 
          placeholder="Type your favourite song name here"
          onChangeText={songName => setSongName(songName)}
          defaultValue={songName}
        />
        <Button title="Find" onPress={getSong}></Button>
      </View>
      <View style={styles.songs}>
        {isLoading ? ( //Display Flatlist only if it has been loaded
          <ActivityIndicator />
        ) : (
        <FlatList 
          data={foundSongs}
          renderItem={renderItem}
          keyExtractor={(item) => item.track.track_id.toString()}
        />
        )}
      </View>
      
        {lyrics.trim() ? ( //Display lyrics and share button only if not empty
        <View style={styles.lyrics}>
            <ScrollView>
            <Text>{lyrics}</Text>
            </ScrollView>
            <Button title="Share" onPress={onShare}></Button>
        </View>
        ) :(
            <ActivityIndicator></ActivityIndicator>
        )}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 35,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 5,
  },
  input: {
    height: 25,
    fontSize: 16, 
    width: "100%",
    borderColor: '#DDD',
    borderWidth: 1,
    textAlign: "center",
    marginBottom: 5
  },
  songs: {
    flex:3
  },
  button: {
    flex: 1
  },
  lyrics: {
    flex: 9,
    padding: 32,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "lightblue"
  },
});
