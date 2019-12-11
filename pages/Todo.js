import React from 'react';
import { StyleSheet, Text, StatusBar, FlatList} from 'react-native';
import { Container,Content,Header, Input, Item, Button, Icon, List,Body,ListItem,CheckBox} from 'native-base';

import * as firebase from 'firebase';
// import { ListItem, CheckBox } from "react-native-elements";

// var Tasks =[
//     {title:"Task1", status: true} , 
//     {title:"Task2", status: false} , 
//     {title:"Task3", status: true} , 
//     {title:"Task4", status: false}];

var Tasks = [];

class Todo extends React.Component {

    state= {
        data: Tasks,
        newTask: ""
    }
    
    componentDidMount(){

        firebase.database().ref('/tasks').on('child_added', (task)=> {
           var newData = [...this.state.data];
           newData.push(task);
           this.setState({data : newData});
        })
    }

    addTask(task) {
      var key = firebase.database().ref('/tasks').push().key;
      firebase.database().ref('/tasks').child(key).set({title : task, status: false});
    }

  async  deleteTask(task){
    await firebase.database().ref('/tasks/'+task.key).set(null);
    var newData = [...this.state.data];
    this.setState({data : newData});
    }
    
  render(){
    return (
      <Container>
            
          <Header style={styles.header}>
              <Content>
                  <Item>
                      <Input
                      placeholder="Add Task Name"
                      placeholderTextColor="#fff"
                      onChangeText={(newTask)=> this.setState({newTask})}
                      style={styles.inputBox}
                      />

                      <Button style={styles.buttonBox} 
                                onPress={()=> this.addTask(this.state.newTask)}>
                          <Icon name="add" style={styles.icon}></Icon>
                      </Button>          
                  </Item>
              </Content>
          </Header>

            <List enableEmptySections>
                <FlatList
                    style={styles.list}
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <ListItem>
                              <CheckBox
                                    checked={ item.status }
                                    onPress={ () => this.onCheckBoxPress(item.status) }
                                    />
                                <Body style={styles.listBody}>
                                    <Text style={styles.listTitle}>{item.val().title}</Text>

                                    <Button style={styles.listButton}
                                                onPress={()=> this.deleteTask(item)}>
                                        <Icon name="trash" style={styles.listIcon} />
                                    </Button>
                                </Body>
                        </ListItem>
                      )}
                />
              </List>


      </Container>
    );
  }
}

const styles = StyleSheet.create({
    header:{
        marginTop:StatusBar.currentHeight,
        backgroundColor:"#3f90b5"
    },
    inputBox:{
        justifyContent: "flex-start",
        color: "#fff"
    },
    buttonBox:{
        justifyContent: "flex-end",
        backgroundColor:"#3f90b5"
    },
    icon:{
        backgroundColor:"#3f90b5"
    },
    list: {
        marginTop: 50
    },
    listBody:{
        flex:1,
        flexDirection: "row",
        justifyContent:'space-between',
        marginStart: 10,
    },
    listTitle: {
        marginTop: 10,
    },
    listIcon:{
        color: "#bc0909",
        alignItems: "center"
    },
    listButton:{
        backgroundColor: "none",
        height: 30,
        width: 30,
    }
});

export default Todo;