import React, { useEffect, useState } from "react";
import axios from "axios";
import { PanelLayout, NFTCard } from "../../components";

const CollectiblesPage = ({ origin }) => {

    const [mintedCollections, setMintedCollections] = useState([]);
    const thisNFT = origin;
    console.log("origin is", origin);

    // TODO: Refactor this to use a reducer
    useEffect(() => {
        (async () => {
            // Get the number of Geist mints
            const userProfile = await axios.get(
                `https://staging-backend.relayx.com/api/profile/geist@relayx.io`
            );

            const totalMints = userProfile.data.data.minted;
            console.log("user data is: ", userProfile.data);

            const pages = Math.ceil(totalMints / 10);

            const filteredGeistCollections = [];

            //Cycle through the pages and get the data
            for (let index = 1; index <= pages; index++) {
                const { data } = await axios.get(
                    `https://staging-backend.relayx.com/api/mint/list?page=${index}&paymail=geist@relayx.io`
                );
                // Filter out the misprints
                const filteredMints = data.data.mints.filter(
                    mint => mint.origin === thisNFT
                );
                console.log("filtered data is: ", filteredMints);
                filteredGeistCollections.push(...filteredMints);
                // console.log("mintedCollections", mintedCollections);
            }
            console.log("filtered geist card: ", filteredGeistCollections.toString());
            setMintedCollections([...mintedCollections, ...filteredGeistCollections]);
        })();
    }, []);

    return (
        <PanelLayout>
            <div className="bg-gray-200 flex flex-wrap">
                {mintedCollections?.map((mintedCollection) => {
                    console.log("mintedCollections", mintedCollections);
                    return (
                        <NFTCard key={mintedCollection.location} nft={mintedCollection} />
                    );
                })}
            </div>
            <p>hllo
                {thisNFT}
            </p>
        </PanelLayout>
    );
}

export default CollectiblesPage;
