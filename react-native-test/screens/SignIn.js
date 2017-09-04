import React, { Component } from 'react';
import {Text, View, Dimensions, Image ,TextInput} from 'react-native';
import {Form, Item, Label, Input, Button, Header, Body, Title} from 'native-base';
import Meteor, {createContrainer,Accounts} from 'react-native-meteor';

// var myBg = require('../assets/icons/bg.jpg');
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

class SignIn extends Component {
  constructor(props) {
       super(props);

       this.state = {
         email: '',
         password: '',
         error: null,
       };
   }


   isValid() {
      const { email, password } = this.state;
      let valid = false;

      if (email.length > 0 && password.length > 0) {
        valid = true;
      }

      if (email.length === 0) {
        this.setState({ error: 'You must enter an email address' });
      } else if (password.length === 0) {
        this.setState({ error: 'You must enter a password' });
      }

      return valid;
    }

    onSignIn = () =>{
      const { email, password } = this.state;

      if (this.isValid()) {
        Meteor.loginWithPassword(email, password, (error) => {
          if (error) {
            this.setState({ error: error.reason });
            alert('Invalid User');

          }
          else{
            alert('Login Success!!');
            console.log(email);
            this.props.navigation.navigate('User');
          }
        });
      }
      console.log(Meteor.userId());
    }

    onCreateAccount = () =>{
      const { email, password } = this.state;
      console.log(email);
      console.log(password);
      if (this.isValid()) {
        Accounts.createUser({ email, password }, (error) => {
          if (error) {
            this.setState({ error: error.reason });
          } else {
            alert('create success');
            // this.onSignIn(); // temp hack that you might need to use
          }
        });
      }
      else{
        console.log('error');
      }
    }

  // logIn = () =>{
  //   var username = this.state.username;
  //   var password = this.state.password;
  //
  //   this.props.signIn(username,password);
  // }

  render() {
    return (
      <View style={{flex: 1}}>

          <View style={styles.inputStyle}>

            <Form>

              <Item inlineLabel>
                <Label> Username </Label>
                <Input
                  autoCorrect={false}
                  onChangeText={(email)=>this.setState({email})}
                  value={this.state.email}
                  />
              </Item>

               <Item inlineLabel>
                <Label> Password </Label>
                <Input
                  // style={{}}
                  autoCorrect={false}
                  onChangeText={(password)=>this.setState({password})}
                  value={this.state.password}
                  secureTextEntry
                  />
              </Item>

            </Form>

            <View style={{marginTop: 10}}>
              <Button
                primary
                block
                onPress={this.onSignIn}
              >
                <Text style={{color: 'white'}}>Sign In</Text>

              </Button>

              <Button
                primary
                block
                onPress={this.onCreateAccount}
              >
                <Text style={{color: 'white'}}>Create Account</Text>

              </Button>
            </View>
          </View>
      </View>
    );
  }
}

const styles = {
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
    height: height
  },
  inputStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 20
  }
}

export default SignIn;
