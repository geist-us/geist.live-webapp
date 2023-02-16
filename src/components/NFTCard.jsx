import React from "react";
import Image from "next/image";

const NFTCard = ({ nft }) => {
  return (
    <div className="bg-blue-500">
      <div style={{ width: "100px", height: "100px", position: "relative" }}>
        <Image
          src={`https://berry2.relayx.com/${nft.berry}`}
          alt={nft.name}
          layout="fill"
        />
      </div>

      <p>{nft.name}</p>
    </div>
  );
};

export default NFTCard;
