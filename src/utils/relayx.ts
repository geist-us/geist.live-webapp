
import axios from 'axios'

const rexieOrigin = '12d8ca4bc0eaf26660627cc1671de6a0047246f39f3aa06633f8204223d70cc5_o2'

export async function checkForRexie(paymail: string): Promise<boolean> {

    try {

        const { data: { data: address } } = await axios.get(`https://api.relayx.io/v1/paymail/run/${paymail}`)

        const { data: { data: { collectibles }} } = await axios.get(`https://staging-backend.relayx.com/api/user/balance2/${address}`)
    
        const rexie = collectibles.filter((collectible: any) => collectible.origin === rexieOrigin)[0]

        console.debug('checkForRexie.result', rexie)

        return typeof rexie !== 'undefined'

    } catch(error) {

        console.error('checkForRexie.error', error)

        return false

    }

}