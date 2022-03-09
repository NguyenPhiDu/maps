import React, { useState } from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import MapView, { Callout, Circle, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from 'react-native-maps-directions';

export default function App() {

  const [home, setHome] = useState({
    latitude: 10.85185385576466,
    longitude: 106.75793529493423,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });
  const [company, setCompany] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        styles={{
          container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
          listView: { backgroundColor: "white" }
        }}
        placeholder="Nhập điểm bắt đầu"
        fetchDetails={true}
        GooglePlacesSearchQuery={{
          rankby: "distance"
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details)
          setHome(
            {
              // id: 1,
              // latitude: 10.80368323371993,
              // longitude: 106.74768092713525,
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            })
          // console.log(details.geometry.location.lat)
          // console.log(company.latitude)
        }}
        query={{
          key: 'AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8',
          language: "vi",
          // components: "country:us",
          types: "establishment",
          radius: 30000,
          location: `${home.latitude}, ${home.longitude}`
        }}
        listViewDisplayed='auto'    // true/false/undefined
      />
      <View style={{
        marginTop: 50, width: '100%'
      }}>
        <GooglePlacesAutocomplete
          styles={{
            container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
            listView: { backgroundColor: "white" }
          }}
          placeholder="nhập điểm đến"
          fetchDetails={true}
          GooglePlacesSearchQuery={{
            rankby: "distance"
          }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details)
            setCompany(
              {
                // id: 1,
                // latitude: 10.80368323371993,
                // longitude: 106.74768092713525,
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
              })
            // console.log(details.geometry.location.lat)
            // console.log(company.latitude)
          }}
          query={{
            key: 'AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8',
            language: "vi",
            // components: "country:us",
            types: "establishment",
            radius: 30000,
            location: `${company.latitude}, ${company.longitude}`
          }}
          listViewDisplayed='auto'    // true/false/undefined
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: home.latitude,
          longitude: home.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        provider={PROVIDER_GOOGLE}
      >
        <Marker
          coordinate={home}
        >
          <Callout><Text>home</Text></Callout>
        </Marker>
        <Marker
          coordinate={company}
          pinColor="black"
          draggable={true}
          onDragStart={(e) => {
            console.log("Drag start", e.nativeEvent.coordinates)
          }}
          onDragEnd={(e) => {
            setCompany(
              {
                latitude: e.nativeEvent.coordinate.latitude,
                longitude: e.nativeEvent.coordinate.longitude
              })
          }}
        >
          <Callout>
            <Text>location</Text>
          </Callout>
        </Marker>
        <MapViewDirections
          origin={home}
          destination={company}
          apikey='AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8'
          strokeWidth={4}
          strokeColor="#00b0ff"
        >
        </MapViewDirections>
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center"
  },
  map: {
    width: '100%',
    height: '100%'
  }
})