import React, { useEffect, useState } from "react";
import "./App.css";
import NFTManager from "./NFTManager";
import WalletConnection from "./WalletConnection";

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [playcanvasReady, setPlaycanvasReady] = useState(false);
  const [nftData, setNftData] = useState([]);

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    // Listen for IFrameReady message from Playcanvas, which let's us know it can receive messages.
    window.addEventListener("message", function (event) {
      if (event.origin === "https://playcanv.as") {
        if (event.data.type === "IFrameReady") {
          setPlaycanvasReady(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (nftData.length > 0 && playcanvasReady) {
      console.log("Loaded NFT:");
      console.log(nftData);

      const pcWindow = document.getElementById("game").contentWindow;
      pcWindow.postMessage(
        {
          type: "StartGame",
          data: nftData[0],
        },
        "*"
      );
    }
  }, [nftData, playcanvasReady]);

  return (
    <div className="App">
      <div className={"container"}>
        <div className="overlay-container">
          <WalletConnection
            walletAddress={walletAddress}
            setWalletAddress={setWalletAddress}
          />
          <NFTManager
            walletAddress={walletAddress}
            nftData={nftData}
            setNftData={setNftData}
          />
        </div>
        <iframe
          src="https://playcanv.as/e/p/zqG68neQ/"
          id="game"
          title="PlayCanvas"
          frameBorder="0"
        ></iframe>
        <div className="footer-container"></div>
      </div>
    </div>
  );
};

export default App;
