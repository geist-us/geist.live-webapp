import React, { useEffect, useState } from "react";
import axios from "axios";
import { PanelLayout, NFTCard } from "../components";

export default function Collectibles() {
  console.log("collectibles");

  const misprints = [
    "254cc23144c64cc9f4c249146ce7c52dc13a76a114fb8eb69347aa5e3e7689bf_o2",
    "5ab72c164de3514848a086e99975be1508124db704f273a616baa42cf820a1dc_o2",
    "28b6e0569c6093f8a65962a2d9d66220d610594a5bc39c2021ace64a4bcd3dfe_o2",
  ];

  // const [totalMints, setTotalMints] = useState(0);
  // const [pages, setPages] = useState(0);
  const [mintedCollections, setMintedCollections] = useState([]);

  // TODO: Refactor this to use a reducer
  useEffect(() => {
    (async () => {
      // Get the number of Geist mints
      const userProfile = await axios.get(
        `https://staging-backend.relayx.com/api/profile/geist@relayx.io`
      );

      const totalMints = userProfile.data.data.minted;

      const pages = Math.ceil(totalMints / 10);

      const filteredGeistCollections = [];

      //Cycle through the pages and get the data
      for (let index = 1; index <= pages; index++) {
        const { data } = await axios.get(
          `https://staging-backend.relayx.com/api/mint/list?page=${index}&paymail=geist@relayx.io`
        );
        // Filter out the misprints
        const filteredMints = data.data.mints.filter(
          (mint) => !misprints.includes(mint.location)
        );
        console.log("mintedCollections", mintedCollections);
        filteredGeistCollections.push(...filteredMints);
        // console.log("mintedCollections", mintedCollections);
      }

      setMintedCollections([...mintedCollections, ...filteredGeistCollections]);
    })();
  }, []);

  return (
    <PanelLayout>
      <p>Collectibles</p>
      <div className="bg-red-500">
        {mintedCollections?.map((mintedCollection) => (
          <NFTCard key={mintedCollection.location} nft={mintedCollection} />
        ))}
      </div>
    </PanelLayout>
  );
}

/*
- get the collections ✅
- show collectibles in a list  ✅
- remove false mints ✅
- create NFTCard component ✅
= Get user's collectibles ✅
- display NFTs in a grid
- Show a sillhoute of the collectibles
- if logged in, show which collectibles you have
- show which ones you don't have as silhouettes
*/