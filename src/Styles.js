import { StyleSheet, Dimensions } from 'react-native';

let fullwidthScreen = (Dimensions.get('window').width);
let widthScreen = (Dimensions.get('window').width - 40);
let widthScreenForm = (Dimensions.get('window').width - 200);

export default StyleSheet.create({
    containerWithHeader: {
        flex: 1,
        backgroundColor: '#EDEEEF',

        alignItems: 'flex-start',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',


    },
    endFlex: {
        justifyContent: 'flex-end',
    },
    checkImg: {
        width: 10,
        height: 8,
    },
    marginTop: {
        marginTop: 20,
    },
    submitButton: {

        height: 40,
        backgroundColor: '#1991EB',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,


    },
    header: {
        paddingTop: 20,
        paddingHorizontal: 20,
        height: 110,
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    breadcrumbContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        // backgroundColor: '#f00',
        justifyContent: 'flex-start',
    },

    breadcrumItem: {

        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,

    },
    breadcrumbBullet: {
        backgroundColor: '#1991EB',
        borderRadius: 28,
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,

    },
    bulletDisabled: {
        borderWidth: 1,
        borderColor: '#C5D0DE',
        backgroundColor: '#fff',
    },

    txtBullet: {
        color: '#fff',
        fontWeight: 'bold',
    },
    breadcrumbText: {
        color: '#516173',
        fontWeight: 'bold',
    },
    txtDisabled: {
        color: '#C5D0DE',
    },
    fieldList: {
        padding: 20,
        flex: 1,

    },
    h1: {
        color: '#354052',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    h2: {
        color: '#354052',
        fontSize: 18,
        fontWeight: 'bold',

    },
    textRed: {
        color: '#ED1C24',
    },
    textBold: {
        fontWeight: 'bold'
    },
    fieldList: {
        alignItems: 'center',
        padding: 40,
        width: Dimensions.get('window').width
    },
    fieldListProdutos: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 40,
        width: Dimensions.get('window').width
    },
    row: {
        // flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: widthScreen
    },
    rowForm: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: widthScreenForm,
        paddingBottom: 20,
        // backgroundColor:'#f00', 
        // backgroundColor:'#ccc'
    },

    btnCancelar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30

    },
    productList: {
        // flex:1,
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        // backgroundColor:'#f00',
        paddingHorizontal: 20,
        // width: fullwidthScreen, 
    },
    productItemList: {
        // flex:1,
        flexDirection: 'row',
        // flexWrap: 'wrap',
        alignItems: 'flex-start',
        // backgroundColor:'#f00',
        paddingHorizontal: 20,
        // width: fullwidthScreen, 
    },
    productListColumn: {
        // flex:1,
        // paddingHorizontal:20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'#ccc',
        width: (fullwidthScreen / 4),
        marginBottom: 20,
        marginRight: 20,
    },
    itemProductImageBox: {
        backgroundColor: '#F4F4F4',
        width: '100%',
        borderRadius: 4,
        height: 40,
        flex: 1,
    },
    itemProductImage: {

        width: '100%',


        flex: 1,
    },
    boxItemProduct: {
        backgroundColor: '#fff',

        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        // flex:1,
        width: 250,
        height: 250,
        marginBottom: 20,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,

        padding: 20,

    },
    padding20: {
        padding: 20,
        flex: 1

    },
    btnProdutos: {
        minWidth: '100%',

    },
    rowBreadCrumProdutos: {
        flexDirection: 'row',
    },
    breadcrumProdutosItem: {
        // backgroundColor:'#ccc',
        // flex:1,
    },
    breadcrumProdutosText: {
        // flex:1,
        color: '#2EA2F8',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 30,
        textDecorationLine: 'underline'
    },
    textBlue: {
        color: '#2EA2F8',

    },
    card: {
        height: 'auto',
        padding: 0,
        flexDirection: 'column',
    },

    cardImageContainer: {
        // backgroundColor: '#F00',
        flex: 1.5,
        width: '100%',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cardImageBox: {
        backgroundColor: '#F4F4F4',
        backgroundColor: '#fff',
        // width: 40,
        borderRadius: 4,
        
        flex: 1,
    },
    itemProductImage:{
        width:'100%',
        height:'auto',
        flex:1
    },
    cardbody: {
        flex: 1,
        
        padding: 20,
        backgroundColor: '#fff',
        justifyContent:'space-between'
    },
    cardfooter: {
        // flex: 1,
        maxHeight:150,
        minHeight:150,
        maxWidth:'100%',
        minWidth:'100%',
    
        padding: 20,
        backgroundColor: '#F6F6F6',
    },
    cardbodyFooter:{

    },
    plTitle:{
        color:'#354052',
        fontSize:18,        
    },
    plDescricao:{
        color:'#7F8FA4',
        fontSize:14, 
        paddingBottom:15,       
    },
    plLabel:{
        color:'#7F8FA4',
        fontSize:14,        
    },
    plLabelFooter:{
        color:'#7F8FA4',
        fontSize:14,        
        height:36,
        // marginRight:10,
        width:45,
        lineHeight:36,

    },
    plPreco:{
        color:'#2EA2F8',
        fontSize:20,        
    },
    plBarras:{
        color:'rgba(46,162,248,.7)',
        fontSize:14,        

        
    },
    cardFooterRow:{
        flexDirection:'row',
        paddingBottom:10,
    },
    stepperContainer:{
        flexDirection:'row',
        backgroundColor:'#fff',
        flex:1,
        borderRadius:4,
        height:36,
        borderWidth:1,
        borderColor:'#E4E4E5',
    },
    sttepperButtonValue:{
        lineHeight:36,
        color:'#2EA2F8',
        fontSize:14,
        flex:1,
        // backgroundColor:'#E4E4E5',
        textAlign:'center',
        borderRightWidth:2,
        borderRightColor: '#E4E4E5',        
    },
    stepperButtonContainer:{
        width:36,
        height:36,
        alignItems:'center',
        justifyContent:'center',                
    },
    btnAddCard:{
        height: 30,
        flexDirection:'row',
        backgroundColor: '#39B54A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,
    },
    colorSelectorContainer:{
        flexDirection:'row',
        height: 30,

    },
    pedidoContainer:{
        backgroundColor:'#edeeef',
        // flex:1,
        paddingBottom:40,
        
    },
    rowFormContainer:{
        paddingBottom:40,
        paddingHorizontal:20,
        flex:1,
        
    },
    formContainer:{
        backgroundColor:'#F6F6F6',
        flex:1,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderRadius:4,
        
    },
    tableHeader:{
         backgroundColor:'#F6F6F6',
         width:'100%',
        minHeight:50,
        borderTopLeftRadius:4,
        borderTopRightRadius:4,
        borderBottomWidth:1,
        borderBottomColor:'#EBEBEB',
    },
    tableBody:{
         
        //  width:'100%',
        //  flex:1,
        // minHeight:100,
        
    },
    th:{
         alignSelf: 'stretch' ,
         padding:10,
         justifyContent:'center',
    },
    td:{
         alignSelf: 'stretch' ,
         padding:10,
         justifyContent:'center',
    },
    thText:{
         color:'#354052',
         fontSize:14,
         fontWeight:'bold',
    },
    tdText:{
         color:'#7F8FA4',
         fontSize:14,
        //  fontWeight:'bold',
    },
    tr:{
        // flex: 1, 
        alignSelf: 'stretch', 
        flexDirection: 'row' ,
        // minHeight:50,
        backgroundColor:'#fff',
        borderBottomWidth:1,
        borderBottomColor:'#EBEBEB',
    },
    tableBorderLeft:{
        borderLeftWidth:1,
        borderLeftColor:'#EBEBEB',
    },
    tableFooter:{
        // backgroundColor:'#f00',
        // flex:1,
        // height:200,
        // width:'100%',
        // minHeight:100,
        padding:20,
        flexDirection:'row'
    },
    textArea:{
        flex:2,
        backgroundColor:'#fff',
        borderRadius:4,
        borderWidth:1,
        borderColor:'rgba(0,0,0,.1)', 
        minHeight:100,
        width:'100%',
        padding:10,
        // paddingHorizontal:20,
        // alignItems: 'flex-start',
        // justifyContent: 'center',
    },
    tableDetails:{
        flex:1,
        paddingLeft:20,

    },
    detailRow:{
        flexDirection:'row',
        paddingBottom:10,
    },
    detailLabel:{
        flex:2,
        color:'#354052',
        fontSize:14,
    },
    detailValue:{
        flex:1,
        color:'#2EA2F8',
        fontSize:14,
        textAlign:'right'
    },
    detailLabelBig:{
        flex:2,
        color:'#354052',
        fontSize:18,
        fontWeight:'bold'
    },
    detailValueBig:{
        flex:1,
        color:'#2EA2F8',
        fontSize:18,
        textAlign:'right',
        fontWeight:'bold'
    },
    rowBtns:{
        paddingHorizontal:20,
        flexDirection:'row',
        flex:1,
        
        justifyContent:'space-between',
    },
    rightBtns:{
        flexDirection:'row',
        
    },
    sendButton: {

        height: 40,
        backgroundColor: '#39B54A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,
        width:200,


    },
    saveButton: {

        height: 40,
        backgroundColor: '#A8AAB7',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        paddingHorizontal: 20,
        width:170,
        marginRight:20,


    },
    alertPedido:{
        flex:1,
        backgroundColor:'#EDEEEF',
        justifyContent:'center',
        alignItems:'center'
    },
    alertPedidoContainer:{
        justifyContent:'center',
        alignItems:'center'
    },
    alertPedidoTitle:{
        marginTop:40,
        color:'#354052',
        fontSize:36
    },
    alertPedidoPergunta:{
        marginTop:10,
        color:'#354052',
        fontSize:24
    },
    alertPedidoButtomBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        paddingTop:20
        
    },
    viewComercial:{
        flexDirection:'row',
        position:'absolute',
        left:60,
        bottom:5,
    },
    descontoItemButton:{
        paddingHorizontal:20,
        opacity:.3
    },
    descontoItemTxt:{
        fontSize:30,
        color:'#ccc'
    },

   
    
});