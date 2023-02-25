import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import Colors  from './src/styles/Colors';
import Navigation from './src/Navigation';
import {DefaultTheme,Provider as RNPaperProvider} from 'react-native-paper'
import {Provider as ReduxProvider} from 'react-redux'
import { createStore } from 'redux';
import reducer from './src/redux/reducer';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,    
  },
};
const store=createStore(reducer)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  

  render() {
    return (
      <ReduxProvider store={store}>
      <RNPaperProvider theme={theme} >
      <StatusBar barStyle='default' backgroundColor={Colors.appColor} />
      <Navigation/>
      </RNPaperProvider>
      </ReduxProvider>
    );
  }
}

export default App;

// import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import Navigation from './src/Navigation';

// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   render() {
//     return (
//       <Navigation/>
//     );
//   }
// }

// export default App;


// import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import { Buffer } from 'buffer';
// import SplashScreen from 'react-native-splash-screen';
// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }

//   componentDidMount(){
//     SplashScreen.hide()

//     const buf = Buffer.from('10020000','hex');

//     console.log(buf.readUInt32BE());

//   }
//   render() {
//     return (
//       <View>
//         <Text> App </Text>
//       </View>
//     );
//   }
// }
