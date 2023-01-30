
import axios from 'axios'

export const geistToken = '56f6c76cddb826c4dde3d7c8230317b48075960f4b329b3bd0a1f476c7b5c970_o2'

export async function checkForGeistMembership(paymail: string): Promise<boolean> {

    try {

        const { data: { data: address } } = await axios.get(`https://api.relayx.io/v1/paymail/run/${paymail}`)

        const { data: { data: { collectibles }} } = await axios.get(`https://staging-backend.relayx.com/api/user/balance2/${address}`)
    
        const geistToken = collectibles.filter((collectible: any) => collectible.origin === geistToken)[0]

        console.debug('checkForGeistMembership.result', geistToken)

        return typeof geistToken !== 'undefined'

    } catch(error) {

        console.error('checkForGeistMembership.error', error)

        return false

    }

}
