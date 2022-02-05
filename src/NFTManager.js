import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import React, { useEffect } from "react";
import { getMetadata } from "./token_metadata";

// Set our network to devnet.
const network = clusterApiUrl("mainnet-beta");

const NFTManager = ({ walletAddress, nftData, setNftData }) => {
  const loadImageData = async (uri) => {
    const response = await fetch(uri);
    const { image } = await response.json();
    return image;
  };

  async function getNFTs() {
    const connection = new Connection(network, "processed");
    const pubKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubKey);
    const tokenOwner = await connection.getParsedTokenAccountsByOwner(pubKey, {
      programId: TOKEN_PROGRAM_ID,
    });
    console.log("Lamports: ", balance);

    for (let i = 0; i < tokenOwner.value.length; i++) {
      if (i > 0) {
        break;
      }

      const val = tokenOwner.value[i];
      const tokenPublicKey = val.account.data.parsed.info.mint;

      try {
        const metadata = await getMetadata(tokenPublicKey);
        const imageURL = await loadImageData(metadata.data.data.uri);
        // console.log(imageURL);
        // console.log(metadata.data);
        // eslint-disable-next-line no-loop-func
        setNftData((nftData) => [
          ...nftData,
          {
            img: imageURL,
          },
        ]);
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching NFTs...");
      getNFTs();
    }
  }, [walletAddress]);

  const renderConnectedContainer = () => {
    if (nftData == null) {
    } else {
      return (
        <div className="connected-container">
          <div className="nft-grid">
            {/* We use index as the key instead, also, the src is now item.gifLink */}
            {nftData.map((item, index) => (
              <div className="nft-item" key={index}>
                <img alt="nft" src={item.img} />
                {item.attributes}
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="wallet-container">
      {walletAddress && renderConnectedContainer()}
    </div>
  );
};

export default NFTManager;
