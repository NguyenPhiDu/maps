import React, { useState, useEffect } from "react"
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Platform, PermissionsAndroid } from "react-native"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import MapView, { Callout, Circle, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from "react-native-geocoder";

export default function App() {

  const key = 'AIzaSyBlduVD6U_I2cpDHlcOWzqIippfMdDSoZ8'
  const [lenght, setLenght] = useState(1)
  const [address, setAddress] = useState("")

  const [home, setHome] = useState({
    latitude: 10.85185385576466,
    longitude: 106.75793529493423,
    // latitude: 0,
    // longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [company, setCompany] = useState({
    latitude: 10.8034,
    longitude: 106.7414,
    // latitude: 0,
    // longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  });

  //lay vi tri hien tai
  const componentDidMount = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        // console.log(position);
        setHome({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  //cap quyen vi tri
  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }
  }

  //lay dia chi hien tai
  const getAddress = async (lat, lng) => {
    Geocoder.fallbackToGoogle(key);
    try {
      const res = await Geocoder.geocodePosition({ lat, lng })
      const addr = (res[0].formattedAddress)
      setAddress(addr)
      console.log("" + addr)
    } catch (error) {
      alert(err)
    }
  }

  useEffect(() => {
    requestPermissions()
    componentDidMount()
    getAddress(home.latitude, home.longitude)
  }, [])

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: '100%',
          borderColor: "black",
          borderBottomWidth: 1,
        }}>
        <Text
          style={{
            paddingVertical: 10,
            paddingHorizontal: 5,
            flex: 3
          }}>
          {address}
        </Text>
        <TouchableOpacity
          style={{
            flex: 1,
            borderColor: "black",
            borderWidth: 1,
            alignItems: "center",
            justifyContent: 'center',
            margin: 10,
          }}
          onPress={() => { setLenght(lenght + 1) }}><Text>seach</Text>
        </TouchableOpacity>
      </View>
      <View style={{
        width: '100%',
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
            console.log(company.latitude)
          }}
          query={{
            key: key,
            language: "vi",
            // components: "country:us",
            types: "establishment",
            radius: 30000,
            location: `${company.latitude}, ${company.longitude}`
          }}
          // listViewDisplayed='auto'    // true/false/undefined
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
        provider='google'
      >
        {/* <Marker
          coordinate={home}
        >
          <Callout><Text>home</Text></Callout>
        </Marker> */}
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
        {lenght >= 2 && <>
          {/* {console.log(lenght)} */}
          <MapViewDirections
            origin={home}
            destination={company}
            apikey={key}
            strokeWidth={4}
            strokeColor="#00b0ff"
          >
          </MapViewDirections>
        </>
          // &&
          // <>{setLenght(1)}</>
        }
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
    marginTop: 50,
    width: '100%',
    height: '100%'
  }
})