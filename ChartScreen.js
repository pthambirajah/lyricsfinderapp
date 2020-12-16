import React,{ useState,useEffect  } from 'react';
import { ActivityIndicator,StyleSheet, Text,TextInput, View, FlatList, Button,ScrollView } from 'react-native';
import axios from 'axios';

export default function ChartScreen() {
  const apiKey = "898d4bbcbae5002db9a10ce43f0bacbb";
  const [countryCode, setCountryCode] = useState('');
  const [charts, setCharts] = useState('FI'); 
  const [lyrics, setLyrics] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const BLUE = "#428AF8";

  //Same workaround as on the homepage
  useEffect(() => {
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=3&country=${countryCode}&f_has_lyrics=1&apikey=${apiKey}`);
      setCharts(result.data.message.body.track_list);
    }
    fetchData();
  },[charts]);

  const loadCharts = () => {
    async function fetchData() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/chart.tracks.get?chart_name=top&page=1&page_size=3&country=${countryCode}&f_has_lyrics=1&apikey=${apiKey}`);
      setCharts(result.data.message.body.track_list);
    }
    setIsLoading(false);
    fetchData();
  }

  const getSongLyrics = (trackID) => {
    async function fetchLyrics() {
      const result = await axios(`https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${trackID}&apikey=${apiKey}`);
      setLyrics(result.data.message.body.lyrics.lyrics_body);
    }
    fetchLyrics();
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
        <Text style={styles.title}>Top songs in {countryCode}</Text>
        <TextInput
        style={styles.input}
          selectionColor={BLUE}
          placeholder="Type your country code here"
          onChangeText={countryCode => setCountryCode(countryCode)}
          defaultValue={countryCode}
        />
        <Button title="Find" onPress={loadCharts}></Button>
      </View>
      <View style={styles.songs}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
        <FlatList 
          data={charts}
          renderItem={renderItem}
          keyExtractor={(item) => item.track.track_id.toString()}
        />
        )}
      </View>
      {lyrics.trim() ? (
      <View style={styles.lyrics}>
        <ScrollView>
          <Text>{lyrics}</Text>
        </ScrollView>
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
    padding: 32,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "lightblue"
  },
});
