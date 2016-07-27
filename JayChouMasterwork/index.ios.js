/**
 * JayChouMasterwork
 * https://github.com/JazysYu/react-native
 * @flow
 */

// 1.引入所需要的控件
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NavigatorIOS
} from 'react-native';

// 2.引入自定义的控件
import AlbumListView from './Views/AlbumListView'

class JayChouMasterwork extends Component {
  // 3.render函数用来渲染当前Component的内容
  render() {
    return (
      <NavigatorIOS ref='nav' initialRoute = { { component: AlbumListView, title: 'JayChou\'s Masterwork' } } 
      style = { styles.container } tintColor='#BDBDBF'/>
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// 标记为程序的主入口（自动生成）
AppRegistry.registerComponent('JayChouMasterwork', () => JayChouMasterwork);