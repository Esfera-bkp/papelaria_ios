import React, { Component } from 'react';

import { View, StyleSheet, Text, Modal,Image,ActivityIndicator } from 'react-native';

import {connect} from 'react-redux';
import {verificaBanco,getInstance,DbErrorT,DbError} from '../classes/DbManager';

import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs';
export  class Loader extends Component {

    state = {
        current:0,
        total:0,
        txtInfo:"Carregando...",
        chamouDb : false,
        qtdeImages:0,
        imagesDownloaded:0,
    };

    interval;
    images = [];


    async componentDidMount(){
        // const repos =  JSON.parse(await AsyncStorage.getItem('@Minicurso.repositories'));
        // if(repos){
    
        //   this.setState({repos});
        // } 
        // await AsyncStorage.setItem('@Minicurso.repositories',JSON.stringify(this.state.repos));
    
      }
      componentWillMount = async () => {
        if(!this.state.chamouDb){
            this.setState({chamouDb:true});
            verificaBanco();            
            
            
            setTimeout(this._startSync,
                2000
            )
             
        }
      }
      
      _showLogin =  () => {
        //   console.log('Show login');
          this.props.showLogin()
        // this._downloadImages();
      }
      _refreshLoader = () =>{
          let perc = Math.floor(this.state.current*100 / this.state.total);
        this.setState({txtInfo:`Processando ${perc}%`}); 
        
      }
      _refreshLoaderImages = () =>{
          let perc = Math.floor(this.state.imagesDownloaded*100 / this.state.qtdeImages);
        this.setState({txtInfo:`Baixando imagens ${perc}%`}); 
        
      }
      _doSync = async (aa) => {
        let db =  await getInstance();
        
        await db.transaction(async (tx) => {
            await tx.executeSql("SELECT * FROM otm_controle order by tabela", [], async (tx, results) => {
                
                // this.setState({txtInfo:`Carregando`}); 
                
                // Get rows with Web SQL Database spec compliance.
                let qtde = results.rows.length;
                
                // console.log("qtde itens");
                // console.log(qtde);
                let objItens = {items:[]};
                for(var i = 0 ; i < qtde; i++){
                    let row = results.rows.item(i);
                    let item = {tabela:row.tabela,date_upd:(row.date_upd == null ? '':row.date_upd)};
                    objItens.items.push(item); 
                }
                // console.log(objItens); 

                // let url = `${this.props.UrlServer}ping.php?tabelas=${JSON.stringify(objItens)}`;
                try{

                
                let url = `${this.props.UrlServer}ping-json.php?tabelas=${JSON.stringify(objItens)}`;
                console.log(url); 
                const pingCall = await fetch(url);
                const txt = await pingCall.json();
                
                console.log(txt.queries.length); 
                if(txt.queries.length>0){
                    this.setState({txtInfo:"Processando 0%"}); 

                    this.interval = setInterval(this._refreshLoader,1000);

                    // console.log(txt.queries.length); 
                    this.setState({total:txt.queries.length}); 
                    // this.setState({txtInfo:`Carregando ${this.state.current} de ${this.state.total}`}); 
                    // console.log(this.state.current);
                    // console.log(this.state.total);
                    for(let x = 0; x < txt.queries.length; x++){
                        if(txt.queries[x]!=null){

                            // console.log(txt.queries[x]);
                            this._executeQ(txt.queries[x]);
                        }else{
                            this.setState({current:this.state.current+1});
                        }
                        // await tx.executeSql(txt.queries[x], [], async (tx, results) => {
                            
                        // },DbError);
                    }
                }else{
                    // this._showLogin();

                    this._downloadImages(); 
                }
            }catch(e){
                console.log("NOT CONNECTED!!!!");
                this._showLogin();
                // console.log(e);
            }

               

                
              },DbError);
          },DbErrorT); 

      }
     
      _executeQ = (query) => {
        let db =   getInstance();
        if(query.indexOf('otm_usuarios') > 0){
            // console.log(query);
        }
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                // console.log("Query completed");
                // query = query.split('"').join("'");
                this.setState({current:this.state.current+1}); 
                
                
                if(this.state.total == this.state.current){
                    // this._showLogin();
                    clearInterval(this.interval); 
                    this._downloadImages();
                }
                // Get rows with Web SQL Database spec compliance.
                

                
              },DbError);
          },DbError);
      }
      
      _downloadImages = async () => {
        this.setState({txtInfo:`Verificando imagens...`}); 
        this.interval = setInterval(this._refreshLoaderImages,1000);
        let db =  await getInstance();
        await db.transaction(async (tx) => {
            await tx.executeSql("SELECT * FROM otm_linhas", [], async (tx, results) => {            
                    this.setState({qtdeImages:(this.state.qtdeImages+results.rows.length)})
                    for(let x = 0 ; x < results.rows.length ; x ++){
                        const item = results.rows.item(x);
                        await  this._downloadImage('linhas/'+item.image);
                    }
              });
              await tx.executeSql("SELECT * FROM otm_cores", [], async (tx, results) => {            
                    this.setState({qtdeImages:(this.state.qtdeImages+results.rows.length)})
                    for(let x = 0 ; x < results.rows.length ; x ++){
                        const item = results.rows.item(x);
                        await  this._downloadImage('cores/'+item.image);
                    }
              });
              await tx.executeSql("SELECT * FROM otm_produtos", [], async (tx, results) => {            
                    this.setState({qtdeImages:(this.state.qtdeImages+results.rows.length)})
                    for(let x = 0 ; x < results.rows.length ; x ++){
                        const item = results.rows.item(x);
                        await this._downloadImage('produtos/'+item.image);
                    }
              });
          },DbErrorT);
          
        }
        _downloadImage = async (url) =>{
            let downloadUrl = this.props.UrlServer+"uploads/"+url;
            let dirs = RNFetchBlob.fs.dirs;
            // console.log(url);
            // console.log(downloadUrl);
            if(await RNFS.exists(dirs.DocumentDir + '/'+url)){
                await  this.setState({imagesDownloaded:this.state.imagesDownloaded+1}); 
  
                if(this.state.imagesDownloaded == this.state.qtdeImages){
                  clearInterval(this.interval); 
                  this._showLogin();                
                  }
            }else{

            
           await RNFetchBlob
            .config({
              fileCache : true,
              path : dirs.DocumentDir + '/'+url,
              // by adding this option, the temp files will have a file extension
            //   appendExt : 'png'
            })
            .fetch('GET', downloadUrl, {
              //some headers ..
            })
            .then( async (res) => {
              // the temp file path with file extension `png`
            //   console.log('The file saved to ', res.path());
              await this.setState({imagesDownloaded:this.state.imagesDownloaded+1}); 

              if(this.state.imagesDownloaded == this.state.qtdeImages){
                clearInterval(this.interval); 
                this._showLogin();                
                }
              // Beware that when using a file path as Image source on Android,
              // you must prepend "file://"" before the file path
            //   imageView = <Image source={{ uri : Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path() }}/>
            }).catch(async (res) => {
                
                await  this.setState({imagesDownloaded:this.state.imagesDownloaded+1}); 
  
                if(this.state.imagesDownloaded == this.state.qtdeImages){
                  clearInterval(this.interval); 
                  this._showLogin();                
                  }
                
              });
            }
      }
      _startSync = async () => {
        
        
         let db =  getInstance();
        
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM appController", [], (tx, results) => {
                
      
                // Get rows with Web SQL Database spec compliance.
                if(results.rows.length > 0) {
                    console.log("appController já criada");
                    this._doSync();
                }else{

                    console.log("PRIMERA VEZ");
                    this._doSync();
                }

                
              });
          },DbErrorT);


        
      }; 

    render() {
    
       
     
     

        return (
            <Modal animationType="fade" transparent={true} visible={this.props.visible}>

                <View style={styles.modalContainer}>
                    <View style={styles.boxContainer}>
                    <View style={styles.loader}>
                        <ActivityIndicator  color="#fff" />
                        </View>
                        <Text style={styles.texto}>{this.state.txtInfo} </Text>
                        <Image source={require('../images/logo_branca.png')} style={{width: 204, height: 78}}  />
                    </View>

                  
                </View>

                

            </Modal>);
    }
    
    





}

const mapStateToProps = state => (
 {
    UrlServer: state.GlobalReducer.UrlServer,
}       
); 
 


const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 40,
    },
    loader:{
        padding:20,
    },
    boxContainer: {
        padding: 20,
        
        borderRadius: 10,
        alignItems: 'center',
        width: 280,


    },
    texto:{
        color:"#fff",
        fontSize:16,
        paddingBottom:30,
    }


});

export default connect(mapStateToProps,null)(Loader);