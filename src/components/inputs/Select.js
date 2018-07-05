import React, { Component } from 'react';





import { View, StyleSheet, Text, TouchableOpacity,Image } from 'react-native';
import ModalFilterPicker from 'react-native-modal-filter-picker'



export default class Select extends Component {
    state = {
        visible: false,
        picked: "Selecione",
        picked_id: "",
        showLabel:true,
    };

    componentDidMount = () => {
        
        if(this.props.selectedValue){
            this.setState({picked:this.props.selectedValue});
        }
        
    }

    updateLabel = (picked) =>{
        // console.log('asdasd');
        this.setState({picked});
    }

    render() {
        const { visible, picked } = this.state;
        const options = this.props.items;
        
       

        let largura = '100%';
        switch(this.props.col){
            case("2"):
            largura = '15%'
            break
            case("3"):
            largura = '24%'
            break
            case("4"):
            largura = '32%'
            break
            case("5"):
            largura = '40%'
            break
            case("6"):
            largura = '49%'
            break
            case("7"):
            largura = '57%'
            break
            case("8"):
            largura = '65%'
            break
            case("10"):
            largura = '82%'
            break
            
        }
       

        return (
            <View style={[styles.container,{maxWidth:largura}]}>
                <TouchableOpacity style={styles.buttonContainer} onPress={this.onShow}>
                { !this.props.hideLabel && 
                
                    <Text style={styles.label} visible={this.state.showLabel}>{this.props.labelText}</Text>
                }
                    <View style={styles.containerDropDown}>
                        <Text style={styles.value} >{picked}</Text>
                        
                        <View style={styles.arrow}>
                        <Image source={require('../../images/icons/arrow_down.png')}    style={{width: 7, height: 4}} />
                        </View>
                    </View>
                </TouchableOpacity>
                <ModalFilterPicker
                    visible={visible}
                    onSelect={this.onSelect}
                    onCancel={this.onCancel}
                    options={options}
                    placeholderText="Filtro"
                    placeholderTextColor= "#354052"
                    cancelButtonText="Cancelar"
                    noResultsText ="Nenhum encontrado"
                    listContainerStyle = {styles.listStyle}
                    filterTextInputContainerStyle = {styles.inputContainerStyle}
                    cancelContainerStyle = {styles.cancelContainerStyle}
                    cancelButtonStyle = {styles.cancelButtonStyle}
                    cancelButtonTextStyle = {styles.cancelTextStyle}
                    titleTextStyle = {styles.titleStyle}
                    
                />
                
            </View>);

    }

    onShow = () => {
        this.setState({ visible: true });
    }
  

    onSelect = (key) => {
        
        let picked = this.props.items.filter( (el,i,array)=>{
            if(el.key == key){
                return el;
            }
        } );
        if(picked.length>0){

            let objPicked = picked[0];
            
            this.setState({
                picked: objPicked.label,
                picked_id: key,
                visible: false
            })

            this.props.onChange(objPicked);
        }
    }

    onCancel = () => {
        this.setState({
            visible: false
        });
    }





}

const styles = StyleSheet.create({
    listStyle:{
       borderRadius:4,
       backgroundColor:'#fff',
       width:'60%',
       maxHeight:'50%',
    },
    inputContainerStyle:{
        backgroundColor:'#fff',
        borderBottomColor:'rgba(0,0,0,0.1)',
        borderBottomWidth:1, 
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
    },
    cancelContainerStyle:{
        
        paddingVertical:20
    },
    cancelButtonStyle:{
        borderRadius:4,
        paddingHorizontal: 20,
        height:40,
        backgroundColor:'#A8AAB7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelTextStyle:{
        color:'#fff',
        fontWeight:'bold',
        backgroundColor:'transparent',
    },
    titleStyle:{
        color:'#354052',
        fontSize:12,
        backgroundColor:'#f00',
    },
    buttonContainer:{
        
        flex:1,
        minWidth:'100%',
        // backgroundColor:'#f00' 
    },
    containerDropDown:{
        flex:1,
        backgroundColor:'#fff',
        borderRadius:4,
        borderWidth:1,
        borderColor:'rgba(0,0,0,.1)', 
        height:40,
        maxHeight:40,
        minHeight:40,
        width:'100%',
        paddingHorizontal:20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        
    },
    label:{
        flex:1,
        fontSize:14,
        color:'#7F8FA4',
        fontWeight:'bold',
        marginBottom:5,
    },
    value:{
        // flex:1,
        color:'#354052',
    },
    arrow:{
        position:'absolute',
        right:20,
    }

});



