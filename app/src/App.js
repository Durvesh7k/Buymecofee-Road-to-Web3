import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import Withdraw from './Withdraw';
import abi from './utils/abi.json';


export default function App() {
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memosArray, setMemosArray] = useState([]);
  const [balance, setBalance] = useState("");

  const owner = process.env.REACT_APP_CONTRACT_OWNER

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;



  const ifConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask not installed")
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("connected to: ", accounts[0]);
        console.log("Owner of the contract: ", owner)
      } else {
        console.log("No account found")
      }

    } catch (e) {
      console.log(e);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask not installed")
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      setAccount(accounts[0]);
      console.log(accounts[0]);

    } catch (e) {
      console.log(e);
    }
  }


  const buyMe = async (e) => {
    e.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const buyMeCoffe = new ethers.Contract(
          contractAddress,
          abi.abi,
          signer
        )

        const tip = { value: ethers.utils.parseEther("0.01") };
        const buyTx = await buyMeCoffe.buyme(`${name}`, `${message}`, tip);
        buyTx.wait();



      } else {
        console.log("Eth object not found")
      }
    } catch (e) {
      console.log(e);
    }

  }

  const loadMemos = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Install metamask")
      }

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const buyMeCoffe = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      )

 

      const memos = await buyMeCoffe.getMemos();
      let memosCleaned = [];
      memos.forEach(memo => {
        memosCleaned.push({
          from: memo.from,
          name: memo.name,
          message: memo.message,
          timestamp: new Date(memo.timestamp * 1000)
        })
      });

      setMemosArray(memosCleaned);
      loadMemos();

      const contractBalance = await provider.getBalance(contractAddress)
      const balanceCleaned = ethers.utils.formatEther(contractBalance);
      setBalance(balanceCleaned);


    } catch (e) {
      console.log(e)
    }

  }

  useEffect(() => {
    ifConnected();
    loadMemos();
  }, [])

  const withDraw = async() => {
    try{
      const { ethereum } = window;
      if (!ethereum) {
        alert("Install metamask")
      }
      console.log("You clicked me");

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const buyMeCoffe = new ethers.Contract(
        contractAddress,
        abi.abi,
        signer
      )

      const withDrawtx = await buyMeCoffe.withdraw();
      withDrawtx.wait();

    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="bg-black min-h-screen ">
      <div className='grid sm:flex justify-items-end justify-center items-center py-2'>
        <h1 className='text-white text-3xl px-4 font-bold mt-2'>Hola!! Buy Durvesh a coffe☕ with the matic </h1>
        <div className='flex justify-end px-2 sm:px-7 mx-10'>
          <button onClick={connectWallet} className='text-white mt-3 w-40 h-10 rounded-md bg-cyan-500 hover:bg-cyan-600 px-2 font-bold'>
            {account !== null ? (
              <span>🟢 Connected</span>
            ) : (
              <span>Connect wallet</span>
            )}
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1  sm:grid-cols-2 justify-center text-black font-bold mt-4'>
        <form className='grid  px-4 sm:px-10 mt-8 h-80' onSubmit={buyMe}>
          <input onChange={e => setName(e.target.value)} className='w-full sm:w-2/3 h-10 outline-none rounded-sm px-2 py-2' placeholder='Enter your name' />
          <textarea onChange={e => setMessage(e.target.value)} rows='5' cols={5} className="outline-none h-40 rounded-sm px-4 py-4 w-full sm:w-2/3" placeholder='Enter the message' />
          <button type='submit' className='bg-yellow-300 hover:bg-yellow-200 rounded-md w-44 h-10 font-semibold'>Buy Durvesh a coffe ☕</button>
        </form>

        <div className="px-4 py-6 w-full">
          <h1 className="font-bold text-xl text-white">Memos</h1>
          <div className="grid grid-cols-1 w-full h-96 mx-1 my-4 px-2 py-4 rounded-md bg-slate-900 justify-center overflow-y-auto">
            {memosArray.map((memo, i) => {
              return (
                <div className=" h-max sm:w-max sm:h-28 mx-4 my-3 bg-slate-600 rounded-md font-semibold" key={i}>
                  <div className="grid  items-center px-2 py-1  ">
                    <span>Account: {memo.from}</span>
                    <span>Name: {memo.name}</span>
                    <span>Message: {memo.message}</span>
                    <span>Time: {memo.timestamp.toString()}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {owner === account && <Withdraw withDraw={withDraw}  balance={balance}/>}
    </div>
  )
}