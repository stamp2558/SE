import React, { Component } from 'react';
import {Platform, Text, View, TextInput, StyleSheet} from 'react-native';
import {Form, Item, Label, Input, Button, Header, Body, Title,Fab,Icon} from 'native-base';
import { Constants, Location, Permissions, MapView } from 'expo';
import Meteor from 'react-native-meteor';

class HelpMe extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  PressHere = () =>{
    if(Meteor.userId()){
      alert('Locations has been Sent!!');
      var point = {lat:this.state.location.coords.latitude, lng: this.state.location.coords.longitude };
      Meteor.call('markInsert',point);
      console.log(this.state.location.coords.longitude);
      console.log(this.state.location.coords.latitude);
    }
    else{
      alert('please login');
    }
  }

  onRecord = () =>{
      this.props.navigation.navigate('Record');
    }

  render() {
    return (
      <View style={{flex: 1}}>

          <View style={styles.inputStyle}>

            <View style={{marginTop: 10}}>
              <Button
                rounded
                danger
                block
                onPress={this.PressHere}
              >
                <Text style={{color: 'white'}}>Press here</Text>

              </Button>

            </View>
          </View>
            <Fab
              active={this.state.active}
              direction="left"
              containerStyle={{ }}
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => this.setState({ active: !this.state.active })}>
              <Icon name="share" />
              <Button style={{ backgroundColor: '#34A34F' }}
                onPress={this.onRecord}
              >
                <Icon name="logo-whatsapp" />
                
              </Button>
              <Button style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
              </Button>
              <Button disabled style={{ backgroundColor: '#DD5144' }}>
                <Icon name="mail" />
              </Button>
            </Fab>
      </View>
    );
  }
}

const styles = {
  inputStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 20
  }
}

export default HelpMe;
