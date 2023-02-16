import React from 'react'

const NFTCard = ({nft}) => {

return (
    <div className='bg-blue-500'>
        {/* <p>{nft.name}</p> */}
        <td>{nft.name}</td>
    </div>
)
}

export default NFTCard