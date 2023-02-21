import React from "react";
import Image from "next/image";

const NFTCard = ({ nft }) => {
  return (
    <div className="pt-6 max-w-sm rounded overflow-hidden shadow-lg ml-auto mr-auto ">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "auto",
          maxHeight: 343, //343
          position: "relative",
        }}
      >
        {false ? (
          <Image
            alt={"Purchase NFTS to view"}
            src={"/images/sillhouette.png"}
            width="100%"
            height="100%"
            layout="responsive"
            margin-top="100px"
            border="10px solid #000"
          />
        ) : (
          <Image
            alt={nft.image}
            src={`https://berry2.relayx.com/${nft.berry}`}
            width="100%"
            height="100%"
            layout="responsive"
            margin-top="100px"
            border="10px solid #000"
          />
        )}
      </div>

      <div className="px-6 py-6">
        <div className="font-bold text-xl mb-2">{nft.name}</div>
        <p className="text-blue-700 text-base">{nft.description}</p>
        <button className="mt-2 text-white-100 bg-blue-800 text-base ml-auto mr-auto rounded">
          <a href={`https://relayx.com/market/${nft.origin}`}>Buy Here:</a>
        </button>
      </div>
      <div className="px-6 pt-2 pb-2">
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Issued: {`${nft.total}`}
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 hover:bg-blue-300">
          <a href={`https://relayx.com/token/${nft.origin}/owners`}>
            Owners: {`${nft.owners}`}
          </a>
        </span>
        <span className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          Floor Price:{" "}
          {nft.price === undefined ? "None" : nft.price / 100000000 + " BSV"}
        </span>
      </div>
    </div>
  );
};

export default NFTCard;
