import React, { useEffect, useState} from "react";
import "./App.css";
import './bootstrap.min.css';
import { ethers } from "ethers";
import {CONTRACT_ADDRESS, CONTRACT_ABI} from "./contracts/contract"
import { networks } from "./contracts/networks"; 


const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [mintText, setMintText] = useState("");
  const [coders, setCoders] = useState([]);
  const [network, setNetwork] = useState('');


  const mint = async () => {
   	  try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        // setContract(contract);

        console.log("Going to pop wallet now to pay gas...")
        let tx = await contract.mint(mintText);
        // Wait for the transaction to be mined
        const receipt = await tx.wait();
    
        // Check if the transaction was successfully completed
        if (receipt.status === 1) {
          alert("Domain minted! https://goerli.etherscan.io/tx/"+tx.hash)
          console.log("Domain minted! https://goerli.etherscan.io/tx/"+tx.hash);
          loadNFTS();
      }
      else {
        setCoders([...coders, mintText])
        setMintText("");
        alert("Transaction failed! Please try again");
      }
     }
      else{
        alert("Please install metamask");
      }
     }
      catch(error){
        if(error.error.code === -32603){
          let sameNameError = error.error.message;
          alert(sameNameError.slice(20));
        }
        console.log(error);
      }


}

  const loadNFTS = async () => {

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        // setContract(contract);

        const totalSupply = await contract.totalSupply();
    
        let results = [];
    
        for(let i = 0; i < totalSupply; i++){
          let coder = await contract.coders(i)
          results.push(coder)
        }
    
        setCoders(results);
        console.log(results);
      }
      else{
        alert("Please install metamask");
      }
      }
      catch(error){
      console.log(error);
      }


   }



	const connectWallet = async () => {
		try {
		  const { ethereum } = window;
	
		  if (!ethereum) {
			alert("Get MetaMask -> https://metamask.io/");
			return;
		  }
	
		  // Fancy method to request access to account.
		  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
		
		  // Boom! This should print out public address once we authorize Metamask.
		  console.log("Connected", accounts[0]);
		  setAccount(accounts[0]);
      loadWeb3Contract();
		} catch (error) {
		  console.log(error)
		}
	  }

    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // Check if we're authorized to access the user's wallet
      const accounts = await ethereum.request({ method: 'eth_accounts' });
  
      // Users can have multiple authorized accounts, we grab the first one if its there!
      if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      setAccount(account);
      } else {
      console.log('No authorized account found');
      }
  
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      setNetwork(networks[chainId]);
    
      ethereum.on('chainChanged', handleChainChanged);
      
      // Reload the page when they change networks
      function handleChainChanged(_chainId) {
      window.location.reload();
      }
    }

  const loadWeb3Contract = async () => {
	  try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("Signer",signer);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contract);
      
      }
      else{
        alert("Please install metamask");
      }
      }
      catch(error){
      console.log(error);
      }
  }

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
      // Try to switch goerli
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // Check networks.js for hexadecimal network ids
      });
      } catch (error) {
      // This error code means that the chain we want has not been added to MetaMask
      // In this case we ask the user to add it to their MetaMask
      if (error.code === 4902) {
          alert("please import Gorli network")
      }
      }
    } else {
      // If window.ethereum is not found then MetaMask is not installed
      alert('MetaMask is not installed. Please install it to use this app: https://metamask.io/download.html');
    } 
    }

  //This runs our function when the page loads.
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    if (network === 'Goerli') {
      loadNFTS();
    }
    }, [account, network]);

    if (network !== 'Goerli') {
			return (
        <div className="col d-flex flex-column align-items-center" style={{marginTop: "250px"}}>
          <p>Please connect to the Goerli Testnet</p>
        <button className="btn btn-primary btn-lg"  onClick={switchNetwork}>
         Click here to switch
        </button>
        </div>
			);
		  }

      else
      if(account !== ""){

  return (
    <div className="outercontainer">
  <div>
<nav className="navbar navbar-light bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">CryptoLovers</a>
    <span>{account}</span>
  </div>
</nav>

<div className="container-fluid mt-5">
  <div className="row">
    <div className="col d-flex flex-column align-items-center">
      <img className="mb-4" src="https://avatars.dicebear.com/api/big-ears/nattygirma27.svg" alt="avators" width="100px"/>
      <h1 className="display-5 fw-bold">Crypto Lovers</h1>
      <div className="col-6 text-center mb-3" >
      <div className="alert alert-info" role="alert">
  Remember use goerli network to mint nfts.
</div>
            <p className="lead text-center">These are some of the most highly motivated crypto genuses in the world!.
             We are inventors, innovators, and creators. <br/>
             Here only one name can be minted. its like username in social media's world. so that you only have tha unique avator.
             Remember the nfts are free. you only need to pay the gas fees in goerli ether.
             <br/>Have fun...</p>
            <div>
              <input 
                type="text"
                value={mintText}
                onChange={(e)=>setMintText(e.target.value)}
                className="form-control mb-2"
                placeholder="e.g. Natty" />
              <button onClick={mint} className="btn btn-primary">Mint</button>
            </div>
          </div>
          <div className="text-center">
            <p>Recent Mints</p>
            </div>
          <div className="col-8 d-flex justify-content-center flex-wrap abc">
            {coders.map((coder, key)=><div className="d-flex flex-column align-items-center" key={key}>
                  <img width="150" alt="avators" src={`https://avatars.dicebear.com/api/big-ears/${coder.replace("#", "")}.svg`} />
                  <span>{coder}</span>
            </div>)}
          </div>
    </div>
  </div>
</div>
  </div>
  </div>
      
)}
else{
  return(

    <div className="col d-flex flex-column align-items-center" style={{marginTop: "250px"}}>
    <button className="btn btn-primary btn-lg" onClick={connectWallet}>
      Connect Wallet
    </button>
  </div>


  );
}

}

export default App;