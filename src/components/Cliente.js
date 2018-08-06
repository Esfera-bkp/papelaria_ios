import React, { Component } from 'react';

import { View, ScrollView, Text, TouchableOpacity, AsyncStorage,Alert,Image } from 'react-native';

import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { getInstance, DbError,salvaOrcamento } from '../classes/DbManager';


import styles from '../Styles'

import Select from './inputs/Select';
import TextField from './inputs/TextField';

import MaskedField from './inputs/MaskedField'; 

export class Cliente extends Component {
    state = {
        ufs: [],
        tributos: [],
        currentPedido: {
            usuario: {},
            cliente: {},
            representante: {}
        },
        entregaMesmoEndereco:false,
        cobrancaMesmoEndereco:false,
        representante: {},
        cliente: {},
        representantes: [],
        clientes: [{ key: '0', label: 'Selecione o representante' }],
    };

    usuario = {};



    async componentDidMount() {

        AsyncStorage.getItem("@OTIMA.user").then((value) => {
            this.usuario = JSON.parse(value);

            let curPed = { ...this.state.currentPedido };
            curPed.usuario = this.usuario;
            this.setState({ currentPedido: curPed });

            AsyncStorage.getItem("@OTIMA.currentPedido").then((value) => {
                if(value && value!='{}'){

                    let curPed = JSON.parse(value);
                    
                    this.setState({ currentPedido: curPed });
                    this.updateLabels(curPed);
                }
    
            }).done();

        }).done();


        


        await this.getRepresentantes();
        await this.getUfs();
        await this.getTributos();


    }

    updateLabels =  (curPed) => {
        this.refs.representantes.updateLabel(curPed.representante.nome);
        this.refs.clientes.updateLabel(curPed.cliente.fantasia);
        this.refs.uf.updateLabel(curPed.cliente.estado_nome);
        this.refs.entrega_uf.updateLabel(curPed.cliente.entrega_estado_nome);
        this.refs.cobranca_uf.updateLabel(curPed.cliente.cobranca_estado_nome);
        this.refs.tributos.updateLabel(curPed.cliente.regime_fiscal_nome);
    }
    getRepresentantes = async () => {

        let db = getInstance();
        let query = "SELECT id, nome,email, telefone FROM otm_representantes order by nome,email";
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {

                let qtde = results.rows.length;
                if (qtde > 0) {
                    let isGestor = false;
                    if (this.usuario.gestor == 1) {
                        isGestor = true;

                    }
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.nome;
                        if (isGestor) {
                            repArray.push(item);
                        } else {
                            // console.log(this.usuario.representante_id + "=="+ item.id);
                            
                            if (this.usuario.representante_id == item.id) {
                                repArray.push(item);
                                if(!this.state.currentPedido.representante.id){
                                    console.log('entrou');
                                    this.refs.representantes.updateLabel(item.nome);
                                    this._representanteChanged(item);
                                }
                            }
                        }
                    }
                    this.setState({ representantes: repArray });

                } else {

                    Alert.alert(
                        'Atenção',
                        'Sem representante vinculado a este usuário!',
                        [
                          
                          {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          
                        ],
                        { cancelable: true }
                      )
                    
                }



            }, DbError);
        }, DbError);
    }
    getUfs = async () => {
        let db = getInstance();
        let query = "SELECT id, short FROM otm_ufs order by name,short";
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.short;

                        repArray.push(item);

                    }
                    this.setState({ ufs: repArray });
                } else {
                    alert('Erro!');
                }



            }, DbError);
        }, DbError);
    }
    getTributos = async () => {
        let db = getInstance();
        let query = "SELECT id, titulo FROM otm_tributos order by id,titulo";
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                let qtde = results.rows.length;
                if (qtde > 0) {
                    let repArray = [];
                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.titulo;
                        repArray.push(item);
                    }
                    this.setState({ tributos: repArray });
                } else {
                    alert('Erro!');
                }
            }, DbError);
        }, DbError);
    }
    getClientes = (representante) => {
        let where = "WHERE representante_id = " + representante.id;
        if (this.usuario.gestor == 1) {
            where = "";
        }
        let db = getInstance();
        let query = `SELECT * FROM otm_clientes ${where} order by fantasia,razao`;
        console.log(query);
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {

                let qtde = results.rows.length;
                if (qtde > 0) {
                    let itemsArray = [];

                    for (let x = 0; x < qtde; x++) {
                        let item = results.rows.item(x);
                        item.key = item.id;
                        item.label = item.fantasia + " - " + item.cnpj;

                        itemsArray.push(item);

                    }
                    this.setState({ clientes: itemsArray });


                } else {
                    Alert.alert(
                        'Atenção',
                        'Nenhum cliente cadastrado para este representante',
                        [
                          
                          {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                          
                        ],
                        { cancelable: true }
                      )
                    
                }



            }, DbError);
        }, DbError);
    }
    _representanteChanged = (representante) => {
        let curPed = { ...this.state.currentPedido };
        curPed.representante = representante;
        this.setState({ currentPedido: curPed });

        this.getClientes(representante);
        

    }
    _ufChanged = async (uf) => {
        let curPed = { ...this.state.currentPedido };
        curPed.cliente.estado_nome = this._getUfName(uf.id);
        curPed.cliente.uf_id = uf.id;        
        await this.setState({ currentPedido: curPed });
        this._verificaEnderecos();
        
    }
    _ufEntregaChanged = (uf) => {
        let curPed = { ...this.state.currentPedido };
        curPed.cliente.entrega_estado_nome = this._getUfName(uf.id);
        curPed.cliente.entrega_uf_id = uf.id;        
        this.setState({ currentPedido: curPed });
        
    }
    _ufCobrancaChanged = (uf) => {
        let curPed = { ...this.state.currentPedido };
        curPed.cliente.cobranca_estado_nome = this._getUfName(uf.id);
        curPed.cliente.cobranca_uf_id = uf.id;        
        this.setState({ currentPedido: curPed });
        
    }
    _regimeFiscalChanged = (regimeFiscal) => {
        let curPed = { ...this.state.currentPedido };
        curPed.cliente.tributo_id = regimeFiscal.key;
        curPed.cliente.regime_fiscal_nome = this._tributoName(regimeFiscal.key);
        this.setState({ currentPedido: curPed });
        
    }

    _getUfName = (uf_id) => {
        
        let obj = this.state.ufs.filter( (el,i,array)=>{
            if(el.key == uf_id){
                return el.label;
            }
        } );
        // console.log(obj);
        if(obj.length > 0){
            return obj[0].label;
        }else{
            return "Selecione";
        }
    }
    _getUfId = (uf_short) => {
        
        let obj = this.state.ufs.filter( (el,i,array)=>{
            if(el.label == uf_short){
                return el.key;
            }
        } );
        // console.log(obj);
        if(obj.length > 0){
            return obj[0].key;
        }else{
            return "Selecione";
        }
    }
    _tributoName = (uf_id) => {
        
        let obj = this.state.tributos.filter( (el,i,array)=>{
            if(el.key == uf_id){
                return el.label;
            }
        } );
        // console.log(obj);
        if(obj.length > 0){
            return obj[0].label;
        }else{
            return "Selecione";
        }
    }
    _clienteChanged = (cliente) => {


        let curPed = { ...this.state.currentPedido };
        cliente.estado_nome = this._getUfName(cliente.uf_id);
        cliente.entrega_estado_nome = this._getUfName(cliente.entrega_uf_id);
        cliente.cobranca_estado_nome = this._getUfName(cliente.cobranca_uf_id);
        cliente.regime_fiscal_nome = this._tributoName(cliente.tributo_id);
        curPed.cliente = cliente;
        this.setState({ currentPedido: curPed });


        this.refs.uf.updateLabel(cliente.estado_nome);
        this.refs.entrega_uf.updateLabel(cliente.entrega_estado_nome);
        this.refs.cobranca_uf.updateLabel(cliente.cobranca_estado_nome);
        this.refs.tributos.updateLabel(cliente.regime_fiscal_nome);

    }
    _verificaEnderecos = () => {
        let curPed = { ...this.state.currentPedido };
        let alterou = false;
        if(this.state.entregaMesmoEndereco){
            alterou = true;
            curPed.cliente.entrega_endereco     = curPed.cliente.endereco;
            curPed.cliente.entrega_bairro       = curPed.cliente.bairro;
            curPed.cliente.entrega_cidade       = curPed.cliente.cidade;
            curPed.cliente.entrega_uf_id        = curPed.cliente.uf_id;
            curPed.cliente.entrega_cep          = curPed.cliente.cep;
            curPed.cliente.entrega_numero       = curPed.cliente.numero;
            curPed.cliente.entrega_estado_nome  = curPed.cliente.estado_nome;
            this.refs.entrega_uf.updateLabel(curPed.cliente.estado_nome); 
        }
        
        if(this.state.cobrancaMesmoEndereco){
            alterou = true;
            curPed.cliente.cobranca_endereco     = curPed.cliente.endereco;
            curPed.cliente.cobranca_bairro       = curPed.cliente.bairro;
            curPed.cliente.cobranca_cidade       = curPed.cliente.cidade;
            curPed.cliente.cobranca_uf_id        = curPed.cliente.uf_id;
            curPed.cliente.cobranca_cep          = curPed.cliente.cep;
            curPed.cliente.cobranca_numero       = curPed.cliente.numero;
            curPed.cliente.cobranca_estado_nome  = curPed.cliente.estado_nome;
            this.refs.cobranca_uf.updateLabel(curPed.cliente.estado_nome);
        }
        if(alterou){
            this.setState({ currentPedido: curPed });
        }
    }
    _setaTexto =  async (txt, campo) => {
        // console.log(this.state.currentPedido);

        let curPed = { ...this.state.currentPedido };

        switch (campo) {                        
            case 'tributo_id': curPed.cliente.tributo_id = txt; break;
            case 'razao': curPed.cliente.razao = txt; break;
            case 'nome_contato': curPed.cliente.nome_contato = txt; break;
            case 'email_contato': curPed.cliente.email_contato = txt; break;
            case 'telefone_direto_contato': curPed.cliente.telefone_direto_contato = txt; break;
            case 'telefone_contato': curPed.cliente.telefone_contato = txt; break;
            case 'fantasia': curPed.cliente.fantasia = txt; break;
            case 'endereco': curPed.cliente.endereco = txt; break;
            case 'numero': curPed.cliente.numero = txt; break;
            case 'bairro': curPed.cliente.bairro = txt; break;
            case 'cidade': curPed.cliente.cidade = txt; break;
            case 'cep': {
                curPed.cliente.cep = txt; 
                if(txt.length == 9){
                    this._buscaCep(txt,'principal');
                }
                break;
            }
            case 'uf_id': curPed.cliente.uf_id = txt; break;
            case 'cnpj': curPed.cliente.cnpj = txt; break;
            case 'ie': curPed.cliente.ie = txt; break;
            case 'email': curPed.cliente.email = txt; break;
            case 'site': curPed.cliente.site = txt; break;
            case 'entrega_endereco': curPed.cliente.entrega_endereco = txt; break;
            case 'entrega_bairro': curPed.cliente.entrega_bairro = txt; break;
            case 'entrega_cidade': curPed.cliente.entrega_cidade = txt; break;
            
            case 'entrega_cep': {
                curPed.cliente.entrega_cep = txt; 
                if(txt.length == 9){
                    this._buscaCep(txt,'entrega');
                }
                break;
            }
            case 'entrega_uf_id': curPed.cliente.entrega_uf_id = txt; break;
            case 'cobranca_endereco': curPed.cliente.cobranca_endereco = txt; break;
            case 'cobranca_bairro': curPed.cliente.cobranca_bairro = txt; break;
            case 'cobranca_cidade': curPed.cliente.cobranca_cidade = txt; break;
            
            case 'cobranca_cep': {
                curPed.cliente.cobranca_cep = txt; 
                if(txt.length == 9){
                    this._buscaCep(txt,'cobranca');
                }
                break;
            }
            case 'cobranca_uf_id': curPed.cliente.cobranca_uf_id = txt; break;
            case 'multiplicador': curPed.cliente.multiplicador = txt; break;
        }


        await this.setState({ currentPedido: curPed });

        this._verificaEnderecos();

    }
    _buscaCep = async (cep,tipo) => {
        const cepF = cep.replace('-','');
        const url = `http://cep.republicavirtual.com.br/web_cep.php?cep=${cepF}&formato=json`;
        console.log(url); 
        const pingCall = await fetch(url);
        const endRes = await pingCall.json();
        console.log(endRes);
        if(endRes.resultado==1){
            let curPed = { ...this.state.currentPedido };
            if(tipo=='principal'){
                curPed.cliente.endereco = endRes.logradouro;
                curPed.cliente.bairro = endRes.bairro;
                curPed.cliente.cidade = endRes.cidade;
                curPed.cliente.uf_id = this._getUfId(endRes.uf);
                curPed.cliente.estado_nome = endRes.uf;
                this.refs.uf.updateLabel(endRes.uf);
                
            }else
            if(tipo=='entrega'){
                curPed.cliente.entrega_endereco = endRes.logradouro;
                curPed.cliente.entrega_bairro = endRes.bairro;
                curPed.cliente.entrega_cidade = endRes.cidade;
                curPed.cliente.entrega_uf_id = this._getUfId(endRes.uf);
                curPed.cliente.entrega_estado_nome = endRes.uf;
                this.refs.entrega_uf.updateLabel(endRes.uf);
                
            }else
            if(tipo=='cobranca'){
                curPed.cliente.cobranca_endereco = endRes.logradouro;
                curPed.cliente.cobranca_bairro = endRes.bairro;
                curPed.cliente.cobranca_cidade = endRes.cidade;
                curPed.cliente.cobranca_uf_id = this._getUfId(endRes.uf);
                curPed.cliente.cobranca_estado_nome = endRes.uf;
                this.refs.cobranca_uf.updateLabel(endRes.uf);
                
            }
            this.setState({ currentPedido: curPed });
        }
    }
    _submit = async () => {

        if( this._validaCampos()){ 
            
            AsyncStorage.setItem("@OTIMA.currentPedido",JSON.stringify(this.state.currentPedido));
            salvaOrcamento(this.state.currentPedido);
            Actions.pagamento();
        }else{
            Alert.alert(
                'Atenção',
                'Preencha os campos obrigatórios marcados com *',
                [
                  
                  {text: 'Ok', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  
                ],
                { cancelable: true }
              )
        }
    }
    _validaCampos = ()=>{
        // elefone direto, fantasia, CNPJ, CEP, Estado e Regime Fiscal
        
        if(!this.state.currentPedido || !this.state.currentPedido.cliente){
            return false;
        }
        if(!this.state.currentPedido.cliente.cnpj || this.state.currentPedido.cliente.cnpj == ''){return false;}
        if(!this.state.currentPedido.cliente.telefone_direto_contato || this.state.currentPedido.cliente.telefone_direto_contato == ''){return false;}
        if(!this.state.currentPedido.cliente.fantasia || this.state.currentPedido.cliente.fantasia == ''){return false;}
        if(!this.state.currentPedido.cliente.nome_contato || this.state.currentPedido.cliente.nome_contato == ''){return false;}
        if(!this.state.currentPedido.cliente.email_contato || this.state.currentPedido.cliente.email_contato == ''){return false;}
        if(!this.state.currentPedido.cliente.cep || this.state.currentPedido.cliente.cep == ''){return false;}
        if(!this.state.currentPedido.cliente.estado_nome || this.state.currentPedido.cliente.estado_nome == ''){return false;}
        if(!this.state.currentPedido.cliente.regime_fiscal_nome || this.state.currentPedido.cliente.regime_fiscal_nome == ''){return false;}
        return true;
        
    }
    changeMesmoEntrega = async() => {
        if(!this.state.entregaMesmoEndereco){
            await this.setState({entregaMesmoEndereco:true});
            this._verificaEnderecos();
        }else{
            this.setState({entregaMesmoEndereco:false});

        }
    }
    changeMesmoCobranca = async () => {
        if(!this.state.cobrancaMesmoEndereco){
            await  this.setState({cobrancaMesmoEndereco:true});
            this._verificaEnderecos();
        }else{
            this.setState({cobrancaMesmoEndereco:false});

        }
    }


    render() {
        const { entregaMesmoEndereco,cobrancaMesmoEndereco } = this.state;
        return (
            <View style={styles.containerWithHeader} >
                <View style={styles.header} >
                    <View style={styles.breadcrumbContainer} >

                        <View style={styles.breadcrumItem}>
                            <View style={styles.breadcrumbBullet}>
                                <Text style={styles.txtBullet}>1</Text>
                            </View>
                            <Text style={styles.breadcrumbText}>Cliente</Text>

                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>2</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Pagamento</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>3</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Prazo de embarque</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>4</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Produto</Text>
                        </View>
                        <View style={styles.breadcrumItem}>
                            <View style={[styles.breadcrumbBullet, styles.bulletDisabled]}>
                                <Text style={[styles.txtBullet, styles.txtDisabled]}>5</Text>
                            </View>
                            <Text style={[styles.breadcrumbText, styles.txtDisabled]}>Pedido</Text>
                        </View>

                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.fieldList}>
                    <View style={styles.row}>
                        <Text style={styles.h1}>Cadastro do cliente</Text>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => { Actions.listagem() }}>
                            <Text style={[styles.textRed, styles.textBold]}>Cancelar Pedido</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Representante</Text>
                    </View>
                    <View style={styles.rowForm}>
                        <Select labelText="Representante" hideLabel onChange={this._representanteChanged} items={this.state.representantes} ref="representantes" ></Select>
                    </View>
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Cliente cadastrado</Text>
                    </View>
                    <View style={styles.rowForm}>
                        <Select labelText="Cliente cadastrado" hideLabel key="clienteDropdown" onChange={this._clienteChanged} items={this.state.clientes} ref="clientes" ></Select>
                    </View>
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Contato</Text>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Nome *" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'nome_contato') }} value={this.state.currentPedido.cliente.nome_contato}  ></TextField>
                        <TextField labelText="Email *" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'email_contato') }} value={this.state.currentPedido.cliente.email_contato}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Telefone direto *" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'telefone_direto_contato') }} value={this.state.currentPedido.cliente.telefone_direto_contato}  ></TextField>
                        <TextField labelText="Telefone" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'telefone_contato') }} value={this.state.currentPedido.cliente.telefone_contato}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Dados Empresariais</Text>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Razão Social" placeholder="" onChange={(txt) => { this._setaTexto(txt, 'razao') }} value={this.state.currentPedido.cliente.razao}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Nome Fantasia *" placeholder="" onChange={(txt) => { this._setaTexto(txt, 'fantasia') }} value={this.state.currentPedido.cliente.fantasia}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                    <MaskedField labelText="CNPJ *" placeholder="" col="6" type={'cnpj'}  options={{format: '99.999.999/9999-99'}} onChange={(txt) => { this._setaTexto(txt, 'cnpj') }} value={this.state.currentPedido.cliente.cnpj}  ></MaskedField>
                        
                        <TextField labelText="Inscrição estadual" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'ie') }} value={this.state.currentPedido.cliente.ie}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Email fiscal" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'email') }} value={this.state.currentPedido.cliente.email}  ></TextField>
                        <TextField labelText="Website" placeholder="" col="6" onChange={(txt) => { this._setaTexto(txt, 'site') }} value={this.state.currentPedido.cliente.site}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                    <MaskedField labelText="CEP *" placeholder="" col="4" type={'zip-code'}  options={{format: '99999-999'}} onChange={(txt) => { this._setaTexto(txt, 'cep') }} value={this.state.currentPedido.cliente.cep}  ></MaskedField>
                        
                        <TextField labelText="Endereço * " placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'endereco') }} value={this.state.currentPedido.cliente.endereco}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Número *" placeholder="" col="4" onChange={(txt) => { this._setaTexto(txt, 'numero') }} value={this.state.currentPedido.cliente.numero}  ></TextField>
                        <TextField labelText="Bairro" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'bairro') }} value={this.state.currentPedido.cliente.bairro}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Cidade" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'cidade') }} value={this.state.currentPedido.cliente.cidade}  ></TextField>

                        <Select labelText="Estado *" col="4" onChange={this._ufChanged} selectedValue={this.state.currentPedido.cliente.uf_id} items={this.state.ufs} ref="uf" ></Select>
                    </View>
                    <View style={styles.rowForm}>

                        <Select labelText="Regime fiscal *" col="12" onChange={this._regimeFiscalChanged} items={this.state.tributos} ref="tributos" ></Select>
                    </View>
                    <View style={styles.rowForm}>
                        <Text style={styles.h2}>Local de entrega e cobrança</Text>
                    </View>
                    <View style={styles.rowForm}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={this.changeMesmoEntrega.bind(this)} >
                        {!entregaMesmoEndereco && (
                                    <Image source={require('../images/check.png')} style={{marginRight:5,width: 20, height: 20}}  />
                                )}
                                {entregaMesmoEndereco && (
                                    <Image source={require('../images/check_active.png')} style={{marginRight:5,width: 20, height: 20}}  />
                                )}
                        </TouchableOpacity>
                        <Text style={styles.label}>Endereço de entrega é o mesmo endereço da empresa</Text>
                    </View>
                    </View>
                    <View style={styles.rowForm}>
                    <MaskedField labelText="CEP" placeholder="" col="4" type={'zip-code'}  options={{format: '99999-999'}} onChange={(txt) => { this._setaTexto(txt, 'entrega_cep') }} value={this.state.currentPedido.cliente.entrega_cep}  ></MaskedField>
                        
                        <TextField labelText="Endereço" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'entrega_endereco') }} value={this.state.currentPedido.cliente.entrega_endereco}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Número" ref="numero" placeholder="" col="4" onChange={(txt) => { this._setaTexto(txt, 'entrega_numero') }} value={this.state.currentPedido.cliente.entrega_numero}  ></TextField>
                        <TextField labelText="Bairro" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'entrega_bairro') }} value={this.state.currentPedido.cliente.entrega_bairro}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Cidade" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'entrega_cidade') }} value={this.state.currentPedido.cliente.entrega_cidade}  ></TextField>

                        <Select labelText="Estado" col="4" onChange={this._ufEntregaChanged} items={this.state.ufs} ref="entrega_uf" ></Select>
                    </View>

                    <View style={styles.rowForm}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={this.changeMesmoCobranca.bind(this)} >
                        {!cobrancaMesmoEndereco && (
                                    <Image source={require('../images/check.png')} style={{marginRight:5,width: 20, height: 20}}  />
                                )}
                                {cobrancaMesmoEndereco && (
                                    <Image source={require('../images/check_active.png')} style={{marginRight:5,width: 20, height: 20}}  />
                                )}
                        </TouchableOpacity>
                        <Text style={styles.label}>Endereço de cobranca é o mesmo endereço da empresa</Text>
                    </View>
                    </View>
                    <View style={styles.rowForm}>
                        <MaskedField labelText="CEP" placeholder="" col="4" type={'zip-code'}  options={{format: '99999-999'}} onChange={(txt) => { this._setaTexto(txt, 'cobranca_cep') }} value={this.state.currentPedido.cliente.cobranca_cep}  ></MaskedField>                        
                        <TextField labelText="Endereço" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'cobranca_endereco') }} value={this.state.currentPedido.cliente.cobranca_endereco}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Número" placeholder="" col="4" onChange={(txt) => { this._setaTexto(txt, 'cobranca_numero') }} value={this.state.currentPedido.cliente.cobranca_numero}  ></TextField>
                        <TextField labelText="Bairro" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'cobranca_bairro') }} value={this.state.currentPedido.cliente.cobranca_bairro}  ></TextField>
                    </View>
                    <View style={styles.rowForm}>
                        <TextField labelText="Cidade" placeholder="" col="8" onChange={(txt) => { this._setaTexto(txt, 'cobranca_cidade') }} value={this.state.currentPedido.cliente.cobranca_cidade}  ></TextField>

                        <Select labelText="Estado" col="4" onChange={this._ufCobrancaChanged} items={this.state.ufs} ref="cobranca_uf" ></Select>
                    </View>
                    <View style={[styles.rowForm, styles.endFlex]}>
                        <TouchableOpacity style={styles.submitButton} onPress={this._submit} >
                            <Text style={styles.buttonText} >Próximo passo</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>


            </View>)
    }





}


const mapStateToProps = state => (
    {
        UrlServer: state.GlobalReducer.UrlServer,
        Versao: state.GlobalReducer.Versao,
        VersaoData: state.GlobalReducer.VersaoData,
    }
);


export default connect(mapStateToProps, null)(Cliente);