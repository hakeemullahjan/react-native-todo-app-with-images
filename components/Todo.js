import React from 'react';
import { TextInput, StyleSheet, Text, Modal, View, Alert, TouchableOpacity, TouchableHighlight, Button, Image, FlatList, ScrollView } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

export default class Todo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      isCameraOpen:false,
      photo:null,
      todoList:[],
      editIndex:0,
      editTodo:false,
    };

    this._openCamera=this._openCamera.bind(this);
    this._cancelCamera=this._cancelCamera.bind(this);
    this._savePhoto=this._savePhoto.bind(this)
}

_openCamera(){
this.setState({isCameraOpen:true});
}


_cancelCamera(){
  this.setState({photo:null});
  this.setState({isCameraOpen:false});
}


_savePhoto(){
  let photo=this.state.photo;
  console.log('current photo====>',photo)
  let todoList=this.state.todoList;
  console.log('todolist===>',todoList)
  let item={key:photo}
  console.log('item to push in todolist====>',item)

  if(this.state.editTodo){
    let index=this.state.editIndex;
    todoList[index]=item
    this.setState({editTodo:false})
  }
  else{
    todoList.push(item);
  }

  this.setState({todoList})
  this.setState({isCameraOpen:false});
  this.setState({photo:null})
}


_deleteTodo(item,index){
  // console.log('delete item======>',item)
  
  let value=item;

  var array = this.state.todoList
  console.log('array before deletion=====>',array)
  var index = index;
  array.splice(index, 1);

  console.log('array after deletion======>',array);
  this.setState({todoList:array})

}



_editTodo(item,index){
console.log('item to edit=====>',item,index);
this.setState({editTodo:true});
this.setState({editIndex:index})
this._openCamera();

}



  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  

  async _capturePicture() {
    console.log(this.camera)
    console.log('taking picture=====>')
    const photo = await this.camera.takePictureAsync()
    console.log('photo *********', photo);
    this.setState({photo: photo.uri})
  }

  
 
  render() {
    console.log(this.props.name)
    console.log(this.state.photo)
    console.log('edit rendering======>',this.state.editIndex,this.state.editTodo)
    const { hasCameraPermission ,isCameraOpen,photo,todoList} = this.state;
    //the condition for front view of user user ADD TODO then open camera
    if(!isCameraOpen){
      return(
        <View style={styles.todoView}>
        <Text style={{fontSize:30}} >TODO APP</Text>
        {/* <Text >hakeemullah</Text> */}
        
        <Button title="ADD TODO" onPress={this._openCamera}  />

      <Text>{'\n'}</Text>
   
         {!!todoList.length && <FlatList
          data={todoList}
           renderItem={({item,index}) =>
           <ScrollView >
             <View style={{flex:1,flexDirection:'row',margin:10}}>

             <View >
             <Image source={{uri: item.key}} style={{width:170,height:120}} />
             </View>

             <View >
             <Button title='EDIT' onPress={this._editTodo.bind(this,item,index)} />
             <Button title='DELETE' onPress={this._deleteTodo.bind(this,item,index)} />
             </View>


             </View>
           </ScrollView>
          }
            />
         }

          {/* {!!photo && <Image source={{uri: this.state.photo}} style={{width:150,height:100}} />}  */}

          
        </View>
      )
    }

    //else conditon for condition for camera of if clicked  on the ADD TODO
    else{

    if (hasCameraPermission === null) {
      return <View />;
    }
     else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
     else {
      return (
        this.state.photo ? 
        <View  style={{ flex: 1 }} >

         <View style={{flex:0.09}} ></View>
        <Image 
        source={{uri: this.state.photo}}
        style={{flex: 0.84}}
         />
         <View style={{flex:0.07,flexDirection:'row',justifyContent:'space-between'}}>
         <Button title='OK'  onPress={this._savePhoto}  />
         <Button title='CANCEL' onPress={this._cancelCamera} />
         </View>
         
        </View>
         
         : 
        <View style={{ flex: 1 }}>
          <Camera  
          ref={ref => {
            this.camera = ref;
          }}

          style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>

              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  alignItems: 'flex-end',
                }}
                onPress={()=>this._capturePicture()}>
                  <Image 
                    source={require('../assets/add-circle-blue-512.png')}
                    style={{width: 100, height: 100}}
                     />
              </TouchableOpacity>

            </View>
          </Camera>
        </View>
      );
    }
  }
}

}


const styles = StyleSheet.create({
  todoView:{
    flex:1,
    // borderWidth:2,
    margin:6,
    marginTop:25,
    backgroundColor:'#fff',
    alignItems:'center'
  }
});

