import React,{ useState,useEffect  } from 'react';
import { StyleSheet, Text,TextInput, View, FlatList, Button, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function ChartScreen() {
  const apiKey = "898d4bbcbae5002db9a10ce43f0bacbb";
  const [songName, setSongName] = useState('');
  const [charts, setCharts] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const BLUE = "#428AF8";

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&s_track_rating=desc&apikey=${apiKey}`);
      if (!ignore) setCharts(result.data.message.body.track_list);
    }
    fetchData();
    return () => { ignore = true; }
  }, [charts]);

  const loadCharts = () => {
    let ignore = false;
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.search?q_track=${songName}&page_size=3&s_track_rating=desc&apikey=${apiKey}`);
      if (!ignore) setCharts(result.data.message.body.track_list);
    }
    setIsLoading(false);
    fetchData();
    return () => { ignore = true; }
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
          title={item.track.track_name +" - "+ item.track.artist_name}
          onPress={() => getSongLyrics(item.track.track_id)}
        />
      );
    };
  return (
    <View style={styles.container}>
      <View style={{flex:3}}>
        <Text style={styles.title}>Find the top songs of the moment</Text>
        <Button title="Find" onPress={loadCharts}></Button>
      </View>
      <View style={styles.songs}>
        {isLoading ? (
          <Text>Please load</Text>
        ) : (
        <FlatList 
          data={charts}
          renderItem={renderItem}
          keyExtractor={(item) => item.track.track_id.toString()}
        />
        )}
      </View>
    </View>
  );
};

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
