import { WialonError } from "@/helpers/classes";

const baseUrl = 'https://hst-api.wialon.com/wialon/ajax.html?';

const options = {
	eventsTimeout: 5
};


// set Remote API 'svc' param
const svc = {
	searchByName: 'core/search_items',
	getAccountData: 'account/get_account_data',
	updFlags: 'core/update_data_flags',
	logout: 'core/logout',
	login: 'token/login'
}


function login(token = '') {
	const sess = new W.Session('https://hst-api.wialon.com', options);

	return new Promise((resolve, reject) => {
		sess.execute(svc.login, { token }, async function () {
			resolve(sess)
		})

		setTimeout(() => {
			reject({ error: 'Нет соединения' })
		}, 20000)
	})

}

async function logout(session) {
	return new Promise((resolve, reject) => {
		session.execute(svc.logout, function (data) {
			console.log('Logout: ', data)
			resolve(data)
		})
	})
}

async function getAccountData(session, params) {
	return new Promise((resolve, reject) => {
		session.execute(svc.getAccountData, params, function (data) {
			console.log('Received: ', data)
			resolve(data)
		})
	})
}

async function getItems(session, params) {
	return new Promise((resolve, reject) => {
		session.execute(svc.updFlags, params, function (data) {
			const items = session.getItems('avl_resource')

			resolve(items)
		})
	})
}

function parseExpireDate(tokenData) {

	let unixTimestamp = tokenData.at + tokenData.dur

	return Intl.DateTimeFormat([], {
		day: '2-digit',
		month: '2-digit',
		year: "2-digit"
	}).format(new Date(unixTimestamp * 1000))

}

export async function getSessionData(token = '') {
	const params = {
		"spec": [{
			"type": "type",
			"data": "avl_resource",
			"flags": 1,
			"mode": 0,
			"max_items": 10000
		}]
	}

	let sess
	try {
		sess = await login(token)
	} catch (e) {
		return e
	}
	const data = await getItems(sess, params)
	await logout(sess)

	return data
}

export async function fetchResourcesDetails(token = '', resourcesIdList = []) {
	const params = {
		params: {
			itemId: resourcesIdList,
			type: 1
		}
	}

	const sess = await login(token)
	const data = await getAccountData(sess, params)
	await logout(sess)
	return data
}

export async function getTokenExpireDate({ name, token }) {
	const sess = new W.Session('https://hst-api.wialon.com', options);

	return new Promise((resolve, reject) => {
		sess.execute(svc.login, { token }, async function (data) {
			// account name validation

			const isValidName = data.au === name
			
			if (!isValidName) {
				const error = { type: 'error', message: 'Имя аккаунта и токен не совпадают' }
				return reject(error)
			} else if (data.error) {
				const error = new WialonError(data)
				return reject(error)
			}

			const tokenData = JSON.parse(data.token)

			resolve({
				expires: parseExpireDate(tokenData)
			})
		})
	})
}