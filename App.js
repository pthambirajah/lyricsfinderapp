import { StatusBar } from 'expo-status-bar';
import React,{ useState,useEffect  } from 'react';
import ReactDOM from "react-dom";
import { StyleSheet, Text,TextInput, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const apiKey = "7842d138b8b694ff711de78ece62dfed";
  const [songName, setSongName] = useState('');
  const [songDummy, setSongDummy] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [foundSongs, setFoundSongs] = useState('');
  const BLUE = "#428AF8";

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&s_track_rating=desc&apikey=${apiKey}`);
      if (!ignore) setSongDummy(result.data.message.body.track_list);
    }
    fetchData();
    return () => { ignore = true; }
  }, [songDummy]);

  const getSong = () => {
    let ignore = false;
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&s_track_rating=desc&apikey=${apiKey}`);
      if (!ignore) setFoundSongs(result.data.message.body.track_list);
    }
    setIsLoading(false);
    fetchData();
    return () => { ignore = true;} 
    }    

  const getSongLyrics = (trackID) => {
    let ignore = false;
    async function fetchLyrics() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackID}&apikey=${apiKey}`);
      if (!ignore) setLyrics(result.data.message.body.lyrics.lyrics_body);
    }
    fetchLyrics();
    return () => { ignore = true;} 
    }

    const renderItem = ({ item }) => {  
      return (
        <Button
          title={item.track.track_name}
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
        {isLoading ? (
          <Text>Nothing loaded</Text>
        ) : (
        <FlatList 
          data={foundSongs}
          renderItem={renderItem}
          keyExtractor={(item) => item.track.track_id.toString()}
        />
        )}
      </View>
      <View style={styles.lyrics}>
        <ScrollView>
          <Text>{lyrics}</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 45,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    alignContent: 'center',
    marginBottom: 5,
  },
  input: {
    height: 25,
    fontSize: 16, 
    width: "100%",
    borderColor: '#DDD',
    borderWidth: 1,
    textAlign: "center"
  },
  songs: {
    flex:3
  },
  button: {
    flex: 1
  },
  lyrics: {
    flex: 9,
  },
});
