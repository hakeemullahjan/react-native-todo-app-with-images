import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Todo from './components/Todo';



export default function App() {
  
  return (
    <View style={styles.container} >

    <Todo name='hakeemullah' ></Todo>
    
  

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
 
  },
});



