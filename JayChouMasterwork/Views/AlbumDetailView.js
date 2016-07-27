import React, { Component } from 'react'
import { View, StyleSheet, Text, ListView, Image } from 'react-native'

const AlbumDescriptionURL = "http://starpedia.oth.web.sdp.101.com/v093/jayEncyclopedia/works/jay/special/3"
const AlbumMusicListURL = "http://starpedia.oth.web.sdp.101.com/v093/jayEncyclopedia/music/jay/list"

class AlbumDetailView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    return r1 !== r2
                },
                getRowData: (data, sectionIndex, rowIndex) => {
                    var rowData = data[sectionIndex][rowIndex]
                    rowData.rowIndex = parseInt(rowIndex) + 1
                    return rowData
                }
            })
        }
        this.fetching = false;
        this.albumID = this.props.route.params.albumData.id
    }

    componentDidMount() {
        fetch(AlbumMusicListURL + "/" + this.albumID)
        .then((response) => response.json())
        .then((responseData => {
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(responseData.rows)
            })
        }))
    }

    renderRow(data) {
        return (
            <View style={{flex:1}}>
                <View style = {{flex:1, flexDirection:'row', height:55, alignItems: 'center'}}>
                    <Text style = {{left:10, color:'#7A7A7A', fontSize:10}} >{data.rowIndex}</Text>
                    <Text style = {{left:26, fontSize:12}}>{data.name}</Text>
                </View>
                <View style={{backgroundColor:'#E2E2E2', height:1, paddingLeft:10, paddingRight:10}}/>
            </View>
        )
    }

    renderHeader() {
        if (this.header == null && this.fetching == false) {
            this.fetching = true
            fetch(AlbumDescriptionURL + "/" + this.albumID)
            .then((response) => response.json())
            .then((responseData => {
                this.header = 
                <View style={{top:0, paddingBottom:15}}>
                    <View style={{ flexDirection : 'row' }}>
                        <Image style={{width:100, height:100, top: 10, left:15 ,borderRadius: 50, borderWidth:3, borderColor:"#E0E0E0"}} source={{ uri: responseData.pic_url }}/>
                        <View style={{left:50, top:10}}>
                            <View style={styles.forFlexDirectionRow}> 
                                <Text style = {styles.headerViewTagLabel} >专辑名称：</Text> 
                                <Text style = {styles.headerViewLabel} >{responseData.name}</Text> 
                            </View>

                            <View style={styles.forFlexDirectionRow}>
                                <Text style = {styles.headerViewTagLabel} >曲目数量：</Text> 
                                <Text style = {styles.headerViewLabel} >{responseData.num}</Text> 
                            </View>

                            <View style={styles.forFlexDirectionRow}> 
                                <Text style = {styles.headerViewTagLabel} >发行时间：</Text> 
                                <Text style = {styles.headerViewLabel} >{responseData.issue_date}</Text> 
                            </View>
                        </View>
                    </View>
                    <Text style={{top:19, paddingBottom:19, paddingLeft:16, paddingRight:16, fontSize:12, lineHeight:16}}>{responseData.desc}</Text>
                </View>
                this.fetching = false;
                this.listView.props.renderHeader()
            }))            
        }
        return this.header
    }

    render() {
        return (
            this.listView = <ListView contentContainerStyle = {{ flexDirection: 'column', flexWrap: 'nowrap', alignItems: 'stretch' }} dataSource = {this.state.dataSource} renderRow = {this.renderRow.bind(this)} renderHeader = {this.renderHeader.bind(this)}/>
        )
    }
}

const styles = StyleSheet.create({
    forFlexDirectionRow : {
        flexDirection : 'row',
        alignItems: 'center',
        height:32
    },
    headerViewTagLabel : {
        fontSize:12,
        color:"#6F6F6F"
    },
    headerViewLabel : {
        fontSize:12,
        color:"#000000"
    }
})

module.exports = AlbumDetailView