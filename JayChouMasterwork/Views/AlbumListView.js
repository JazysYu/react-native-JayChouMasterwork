import React, { Component } from 'react'
import { View, StyleSheet, Text, ListView, Image, RefreshControl, Alert } from 'react-native'
import AlbumDetailView from './AlbumDetailView.js'
import Button from 'apsl-react-native-button'

const pageCount = 5

const RequestURL = 'http://starpedia.oth.web.sdp.101.com/v093/jayEncyclopedia/works/jay/list'

var cacheManager = require('react-native').NativeModules.JCCacheManager

var datas = new Array()

class AlbumListView extends Component {

    constructor(props, listView) {
        //构造函数必须要调super
        super(props)
        this.state = {
            refreshing : false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    return r1 !== r2
                },
                getRowData: (data, sectionIndex, rowIndex) => {
                    return data[sectionIndex][rowIndex]
                }
            })
        }
    }

    componentDidMount() {
        cacheManager.cache((cachedData) => {
            if (cachedData.length > 0) {
                this.datas = cachedData[0]
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    refreshing : false
                })
            } else {
                this.pullToRefresh()
            }
        })
    }

    pushToAlbumDetailView(data) {
        if (data.works_type != 3) {
            return
        }
        // params : 传值，在下个页面可以通过this.props.route.params获取到参数
        this.props.navigator.push({ component: AlbumDetailView, title: data.name, params:{albumData:data}})
    }

    renderRow(data) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#DDDDDD', width: 4, height: 143, left: 35 }}/>
                <View style={{ flex: 1, left: 64 }}>
                    <Text style={{ color: '#A0A0A0', bottom: 15 }}>{data.issue_date}</Text>
                    <Text stype={{ top: 15 }}>{data.name}</Text>
                </View>
                <Image style={{ width: 100, height: 100, right: 25 }} source={{ uri: data.pic_url }} onStartShouldSetResponder={(evt) => true} onResponderRelease={(event) => {
                    this.pushToAlbumDetailView(data)
                }} />
            </View>
        )
    }

    fetchDataWithCountAndSkipCount(count, skipCount) {
        fetch(RequestURL + '/' + skipCount + '/' + count, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseData) => {

                if (responseData.rows.length == 0) {
                    return
                }

                if (skipCount == 0) {
                    this.datas = responseData.rows
                } else {
                    this.datas.push.apply(this.datas, responseData.rows)
                }

                cacheManager.setCache(this.datas)

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.datas),
                    refreshing : false
                })
            })
            .catch((error) => {
                this.state.refreshing = false
                alert(error)
            })
            .done()
    }

    pullToRefresh() {
        this.state.refreshing = true
        this.fetchDataWithCountAndSkipCount(pageCount, 0)
    }

    loadMore() {
        this.fetchDataWithCountAndSkipCount(pageCount, this.datas.length)
    }

    render() {
        return (
            <View style={styles.rootView}>
                <ListView refreshControl = {<RefreshControl refreshing = {this.state.refreshing} 
                onRefresh = {this.pullToRefresh.bind(this)} enabled = {true} />} 
                contentContainerStyle = {{ flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch' }} 
                dataSource = {this.state.dataSource} renderRow = {this.renderRow.bind(this)}/>
                <Button style={{ alignItems: 'center', justifyContent: 'center' }} 
                textStyle={{ color: '#41A9DE', fontSize: 13 }} onPress={this.loadMore.bind(this)}>
                    加载更多
                </Button>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
})

module.exports = AlbumListView