const Web3 = require('web3')
require('dotenv').config({path:'../.env'});

// const web3 = new Web3(`ws://${process.env.internal_url}:${process.env.esc_ws_port}`)
const web3 = new Web3("wss://api-testnet.elastos.io/esc-ws");
const { hex2a } = require('./helper')

// a list for saving subscribed event instances
const subscribedEvents = {}
// Subscriber method
const subscribeLogEvent = (contract, eventName) => {

  //console.log("xxl web3 123 ---- ",web3.utils._);
  const eventJsonInterface = web3.utils._.find(
    contract._jsonInterface,
    o => o.name === eventName && o.type === 'event',
  )

  const subscription = web3.eth.subscribe('logs', {
    address: contract.options.address,
    topics: [eventJsonInterface.signature]
  }, (error, result) => {
    
    console.log("xxl 1",error,result);
    if (!error) {
      const eventObj = web3.eth.abi.decodeLog(
        eventJsonInterface.inputs,
        result.data,
        result.topics.slice(1)
      )

      console.log("xxl eventObj ",eventObj);
      // console.log("xxl 2",eventObj);
      // if(eventObj.hasOwnProperty("logNum")){
      //   console.log("--------------search log--------------"); 
      //   console.log("data logNum :  ",eventObj.logNum); 
      //   console.log("data requestId :", eventObj.requestId)
      //   console.log("data data :", eventObj.data)
      //   console.log("block number :  ",result.blockNumber); 
      //   console.log("data datahash :", eventObj.datahash)
      //   console.log("data totalSearchNum :", eventObj.totalSearchNum)
      //   console.log("data hitSearchNum :", eventObj.hitSearchNum)

      // }else if(eventObj.hasOwnProperty("key")){
      //   console.log("--------------search condition--------------"); 
      //   console.log("block number :  ",result.blockNumber); 
      //   console.log("data requestId :", eventObj.requestId)
      //   console.log("data searchKey :", eventObj.key)
      // }else if(eventObj.hasOwnProperty("data")){
      //   console.log("\n**************search result**************"); 
      //   //console.log("data bytes:", eventObj.data)
      //   //console.log("data hash :", web3.utils.sha3(eventObj.data));
      //   console.log("block number :  ",result.blockNumber); 
      //   console.log("data requestId :", eventObj.requestId)
      //   console.log("data result :", hex2a(eventObj.data));
      // }else{
      //   console.log("unused event");
      // }

    }

  })

  subscribedEvents[eventName] = subscription
}

const {
  readConfig,
} = require('./helper')

const main = async () => {

  console.log("**************** watch elink data ****************");
  let data = "0x0a2b347df0354d55f4b451d3a1a7406d114fe9a86aa025ad80a60ac00fc47726000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000007507b226a736f6e727063223a22322e30222c226964223a372c22726573756c74223a7b226964223a226469643a656c6173746f733a69554c52654e34354e4455727a4c316647783364487236327a4e774d7546734175782370617373706f7274222c22737461747573223a322c227472616e73616374696f6e223a5b7b2274786964223a2235343566356664393933326239643731376332363261386365663763356464376662383238636138366139373163663033613330316262656633333735613631222c2274696d657374616d70223a22323032322d30312d32315430333a31343a30345a222c226f7065726174696f6e223a7b22686561646572223a7b2273706563696669636174696f6e223a22656c6173746f732f63726564656e7469616c2f312e30222c226f7065726174696f6e223a227265766f6b65227d2c227061796c6f6164223a226469643a656c6173746f733a69554c52654e34354e4455727a4c316647783364487236327a4e774d7546734175782370617373706f7274222c2270726f6f66223a7b2274797065223a224543445341736563703235367231222c22766572696669636174696f6e4d6574686f64223a226469643a656c6173746f733a69554c52654e34354e4455727a4c316647783364487236327a4e774d754673417578237072696d617279222c227369676e6174757265223a22386e586f6866777a2d31642d536776676d7135774b536f5054435756645f33696d686f6972564561535f707678756e3579346b5556544450714f737a374f524d6d4e7330396a416b2d596a724b58766b566d32743751227d7d7d2c7b2274786964223a2265623365626337393838363466666332633532623634656630383264666664306333353534626135386439663939353739396237623631663661373063373661222c2274696d657374616d70223a22323032322d30312d32315430333a31333a34345a222c226f7065726174696f6e223a7b22686561646572223a7b2273706563696669636174696f6e223a22656c6173746f732f63726564656e7469616c2f312e30222c226f7065726174696f6e223a226465636c617265227d2c227061796c6f6164223a2265794a705a434936496d52705a44706c6247467a6447397a4f6d6c5654464a6c546a5131546b5256636e704d4d575a4865444e6b534849324d6e704f64303131526e4e426458676a6347467a63334276636e51694c434a306558426c496a7062496c4e6c62475a51636d396a624746706257566b51334a6c5a47567564476c6862434973496c5a6c636d6c6d6157466962475644636d566b5a57353061574673496c3073496d6c7a6333566c63694936496d52705a44706c6247467a6447397a4f6d6c5654464a6c546a5131546b5256636e704d4d575a4865444e6b534849324d6e704f64303131526e4e42645867694c434a7063334e315957356a5a555268644755694f6949794d4449794c5441784c5449785644417a4f6a45784f6a413257694973496d563463476c7959585270623235455958526c496a6f694d6a41794e7930774d5330794d5651774d7a6f784d546f774e6c6f694c434a6a636d566b5a5735306157467355335669616d566a6443493665794a705a434936496d52705a44706c6247467a6447397a4f6d6c5654464a6c546a5131546b5256636e704d4d575a4865444e6b534849324d6e704f64303131526e4e42645867694c434a75595852706232356862476c3065534936496c4e70626d6468634739795a534973496e426863334e7762334a30496a6f69557a59314d7a49314f466f774e794a394c434a77636d39765a69493665794a306558426c496a6f6952554e455530467a5a574e774d6a5532636a45694c434a6a636d56686447566b496a6f694d6a41794d6930774d5330794d5651774d7a6f784d546f774e6c6f694c434a325a584a705a6d6c6a595852706232354e5a58526f623251694f694a6b615751365a57786863335276637a7070565578535a5534304e55354556584a365444466d5233677a5a4568794e6a4a36546e644e64555a7a515856344933427961573168636e6b694c434a7a6157647559585231636d55694f694a685755394357565245596d46504e6d4a6c645852534d3138775131564a57456c7a616c52746555527259306b7756544278515764485a48526952456c77634846755755355365477044515735696155687863455a4657477861546e6c52576a52354c5546695a47733551336430526d4e355a794a396651222c2270726f6f66223a7b2274797065223a224543445341736563703235367231222c22766572696669636174696f6e4d6574686f64223a226469643a656c6173746f733a69554c52654e34354e4455727a4c316647783364487236327a4e774d754673417578237072696d617279222c227369676e6174757265223a2252754b6e4467444838316f61715f6832666878674455757074566862326d504a685669586f564e786f693862545769667469505933645839774d3654535946337739682d3477672d314d544d477639786341676d6f41227d7d7d5d7d7d0a00000000000000000000000000000000"
  console.log("data result:",hex2a(data));


  // let dataConsumerAddress = await readConfig("1","DATACONSUMER_ADDRESS");
  // const dataConsumer = require('../artifacts/contracts/DataConsumer.sol/DataConsumer.json');

  // let dataConsumerInstance = new web3.eth.Contract(dataConsumer.abi,dataConsumerAddress)

  // subscribeLogEvent(dataConsumerInstance,"Log");
  // subscribeLogEvent(dataConsumerInstance,"SearchInfo");

  // // subscribeLogEvent(dataConsumerInstance,"SearchResult1");
  // // subscribeLogEvent(dataConsumerInstance,"SearchResult2");
  // // subscribeLogEvent(dataConsumerInstance,"SearchResult3");
  // // subscribeLogEvent(dataConsumerInstance,"SearchResult4");

  // subscribeLogEvent(dataConsumerInstance,"SearchConformed");
  

  

}

main();