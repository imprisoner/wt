import { Resource } from '../helpers/classes'

export async function getSessionData(token) {
    const response = await fetch("./src/mocks/mockdata.json")
    const json = await response.json()
    let data
    switch (token) {
        case 'f12c71152612d310250fb65e0570e98c8466F6EF70A2DECD649BFD90AF8BBD6AF0E0ADEB':
            data = json.find(item => item.name === 'psmgroup')
            data.list = data.list.map(item => item.d)
            break;
        case '1a81ada3ec22d67c00624628b2e91a70C8A8FB33932D44E259EBE1D7F230C13B6A890040':
            data = json.find(item => item.name === 'psmgroup1')
            data.list = data.list.map(item => item.d)
            break;
        case 'a41cbe6103fbd1cf848a493d3428c8edC49D662494FA3BED03472FAD094FD8CC8C16BB82':
            data = json.find(item => item.name === 'psmgroup2')
            data.list = data.list.map(item => item.d)
            break;
        case '657dc6ae7bc31ce4f9d9e34370b6edb904C65809620B060A5DB533F789FCD053D661D03B':
            data = json.find(item => item.name === 'psmgroup3')
            data.list = data.list.map(item => item.d)
            break;
        case '48bf264a74dffa7690ec8909fbef1ae2B7002D970B654A57FC0C076915D5FCAEAF42CA41':
            data = json.find(item => item.name === 'psmgroup4')
            data.list = data.list.map(item => item.d)
            break;
        case 'a27c74d572ea8f3b954fb8483debedebDFD4C6A3E5EE6850408FA6934561C56B6EFB7CF9':
            data = json.find(item => item.name === 'psmgroup5')
            data.list = data.list.map(item => item.d)
            break;
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data.list)
        }, 200)
    })
}

export async function fetchResourcesDetails(account = '') {
    const response = await fetch(`./src/mocks/${account}.json`)
    const data = await response.json()
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data)
        }, 300)
    })
}

export async function getTokenExpireDate({ name, token }) {
    const response = await fetch('./src/mocks/accounts.json')
    const data = await response.json()

    const isValidToken = Object.keys(data).includes(token)
    let isValidName

    if (isValidToken) {
        isValidName = data[token].au === name
    }


    return new Promise((resolve, reject) => {
        setTimeout(() => {
                
            if(!(isValidName&&isValidToken)) {
               return reject({type: 'error', message: 'Код ошибки: 4. Вероятная причина: НЕВЕРНЫЙ ТОКЕН'})
            }
            console.log('After rejection')
            resolve(data[token])
        }, 200)
    })
}
