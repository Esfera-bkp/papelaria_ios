

import create from './otima_create.json';
import insert from './insert_controle.json';
//import RNFetchBlob from 'react-native-fetch-blob'


let SQLite = require('react-native-sqlite-storage');

export const  getInstance=()=>{
        
        // if(this.db){
            
        //      return this.db; 
        // }else{ 
            // let db = SQLite.openDatabase("myDatabase.db", "1.0", "Demo", -1);
            let db = SQLite.openDatabase({name: 'papelaria9.db', location:"default"},DbSuccess, DbError);    
            return db;
        // }
    };
    export const   DbError=(err)=>{
        console.log("SQL Error: "+JSON.stringify(err));
    }
    export const   DbErrorT=(err)=>{
        console.log("SQL Error Transaction: "+JSON.stringify(err));
    }
    
    export const   DbSuccess=()=>{
        console.log("Database Success");
    }
    export const   executeQuery=(query)=>{
        let db = getInstance();

        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                console.log("Query completed2");
      
                // Get rows with Web SQL Database spec compliance.
                return results.rows;

                
              },(e)=>{console.log("ERROR 1:" + JSON.stringify(e));});
          },(e)=>{console.log("ERROR 12:" + JSON.stringify(e)); });

    }

    export const   iniciaBanco=()=>{
        
        let db = getInstance();

        
        
        let queries  = create.txt.split(';');
        // console.log(queries);
        let queries2  = insert.txt.split(';');
        // console.log(queries2);
        db.transaction((tx) => {
            for(var i = 0; i < queries.length; i++){
                tx.executeSql(queries[i], [], (tx, results) => {console.log("Query completed");});
            }
            
        });
       
        setTimeout(()=>{insertControles()},
            1000
        )
        
        return true;
    }

    export const   insertControles=()=>{
        
        let db = getInstance();

        
        let queries2  = insert.txt.split(';');
      
        db.transaction((tx) => {
          
            for(var x = 0; x < queries2.length; x++){
                console.log(queries2[x]);
                tx.executeSql(queries2[x]+";", [], (tx, results) => {console.log("Query Insert controle");});
            }
        });

        
        return true;
    }
    export const verificaBanco=()=>{
        let db = getInstance();

        db.transaction((tx) => {
            tx.executeSql("select * from otm_controle", [], (tx, results) => {
                console.log("Query completed2");
      
                // Get rows with Web SQL Database spec compliance.
                let len = results.rows.length;
                if(len>0){
                    return true;
                }else{
                    return iniciaBanco();
                    return false;
                }

                
              });
          },(e)=>{console.log("ERROR 12:" + JSON.stringify(e)); return iniciaBanco();});

    }
   
    export const isConnected = () => {
        const repoCall =  fetch("http://google.com");
        console.log("repoCall"+repoCall);
        if(repoCall != ''){
            return true;
        }else{
            return false;
        }
    }


