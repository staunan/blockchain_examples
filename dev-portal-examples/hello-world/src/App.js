import React from 'react';
import './App.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contractAddress: '',
      setHelloValue: '',
      welcomeMsg:''
    };

    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHelloChange = this.handleHelloChange.bind(this);
    this.setHello = this.setHello.bind(this);
    this.getHello = this.getHello.bind(this);
    this.connectZilpay = this.connectZilpay.bind(this);
  }

  async componentDidMount() {
    // We are using setTimeout, as the ZilPay object is not available right away after the page loads
    // The wallet injects the zilPay object after the page loads
    setTimeout(async function(){
      await this.connectZilpay();
      this.observeAccount();
    }.bind(this), 1000);
  }


  handleAddressChange(event) {
    this.setState({contractAddress: event.target.value});
  }

  handleSubmit() {
    localStorage.setItem("contract_address", this.state.contractAddress);
  }

  handleHelloChange(event) {
    this.setState({setHelloValue: event.target.value});
  }

  async setHello(){
    if(window.zilPay.wallet.isEnable){
      this.updateWelcomeMsg();
    }
    else{
      const isConnect = await window.zilPay.wallet.connect();
      if (isConnect) {
        this.updateWelcomeMsg();
      } else {
        alert("Not able to call setHello as transaction is rejected");
      }
    } 
  }

  async updateWelcomeMsg(){
    const zilliqa = window.zilPay;
    let setHelloValue = this.state.setHelloValue;
    let contractAddress = localStorage.getItem("contract_address");
    const myGasPrice = zilliqa.utils.units.toQa('1000', zilliqa.utils.units.Units.Li);
    contractAddress = contractAddress.substring(2);
    const ftAddr = zilliqa.crypto.toBech32Address(contractAddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'setHello',
            [
                {
                    vname: 'msg',
                    type: 'String',
                    value: setHelloValue
                }
            ],
            {
                amount: zilliqa.utils.units.toQa(0, zilliqa.utils.units.Units.Zil),
                gasPrice: myGasPrice,
                gasLimit: zilliqa.utils.Long.fromNumber(10000),
            },
            true
        );
    } catch (err) {
        console.log(err);
    }
  }

  async getHello(){
    if(window.zilPay.wallet.isEnable){
      this.getWelcomeMsg();
    }
    else{
      const isConnect = await window.zilPay.wallet.connect();
      if (isConnect) {
        this.getWelcomeMsg();
      } else {
        alert("Not able to call setHello as transaction is rejected")
      }
    } 
  }

  async getWelcomeMsg(){
    const zilliqa = window.zilPay;
    let contractAddress = localStorage.getItem("contract_address");
    const CHAIN_ID = 333;
    const MSG_VERSION = 1;
    const VERSION = zilliqa.utils.bytes.pack(CHAIN_ID, MSG_VERSION);   
    const myGasPrice = zilliqa.utils.units.toQa('2000', zilliqa.utils.units.Units.Li); // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2);
    const ftAddr = zilliqa.crypto.toBech32Address(contractAddress);
    try {
        const contract = zilliqa.contracts.at(ftAddr);
        const callTx = await contract.call(
            'getHello',
            [
            ],
            {
                // amount, gasPrice and gasLimit must be explicitly provided
                version: VERSION,
                amount: new zilliqa.utils.BN(0),
                gasPrice: myGasPrice,
                gasLimit: zilliqa.utils.Long.fromNumber(10000),
            }
        );
        console.log(JSON.stringify(callTx.TranID));
        this.checkTransaction(callTx);
    } catch (err) {
        console.log(err);
    }
  }

  async checkTransaction(callTx){
    console.log(callTx);
  }

  // This method returns the current state of the contract, which means what values are present in the contract's variable.
  // The whole contract state gets returned.
  async getContractState(){
    const zilliqa = window.zilPay;
    let contractAddress = localStorage.getItem("contract_address");
    const ftAddr = zilliqa.crypto.toBech32Address(contractAddress);
    const contract = zilliqa.contracts.at(ftAddr);
    let data = await contract.getState();
    console.log(data);
  }


  // This method returns the state of the provided variable
  // Which means value that is present in the provided variable gets returned.
  async getContractSubState(){
    let varName = "_balance"; // Every contract has "_balance" variable by default which contains the current balance of the contract
    const zilliqa = window.zilPay;
    let contractAddress = localStorage.getItem("contract_address");
    const ftAddr = zilliqa.crypto.toBech32Address(contractAddress);
    const contract = zilliqa.contracts.at(ftAddr);
    let data = await contract.getSubState(varName);
    console.log(data);
  }

  // The following method watches for account changes, if user changes his account, the alert shows
  async observeAccount(){
    const accountStreamChanged = window.zilPay.wallet.observableAccount().subscribe(account => {
      console.log("New Account Detected : ", account);
    });
    // accountStreamChanged.unsubscribe();
  }

  async connectZilpay(){
    try {
      await window.zilPay.wallet.connect();
      if(window.zilPay.wallet.isConnect){
        localStorage.setItem("zilpay_connect", true);
      } else {
        alert("Zilpay connection failed, try again...")
      }
    } catch (error) {}
  }  
  render(){
    return (
      <div className="App">
        <div> {`Current Contract Address : ${localStorage.getItem("contract_address")}`} </div>
        <h3>Update Contract Address</h3>
        <form onSubmit={this.handleSubmit}>
        <label>
          New Address <br/>
          <input type="text" onChange={this.handleAddressChange} size="70" placeholder="Format: 0x47d9CEea9a2DA23dc6b2D96A16F7Fbf884580665"/>
        </label><br/>
        <input type="submit" value="Submit" />
        <hr></hr>
      </form>
      <div> Hello World Contract Transitions</div><br/>
        <label>
          Set Hello 
          </label><br/>
          <input type="text" onChange={this.handleHelloChange} size="30"/>
        <br/>
        <button onClick={this.setHello}>Set Hello</button><br/><br/>
        <label>
          Get Hello
        </label><br/>
        <button onClick={this.getHello}>Get Hello</button><br/><br/>
        <div> {`Current Welcome Msg : ${this.state.welcomeMsg}`} </div>
        <hr></hr>
        {!localStorage.getItem("zilpay_connect") && <button onClick={this.connectZilpay}>Connect Zilpay</button>}
        <br/><br/>
        <button onClick={this.getContractState}>Get Contract State</button>
        <br/>
        <button onClick={this.getContractSubState}>Get Contract Sub State</button><br/><br/>
      </div>
    );
  }
}
