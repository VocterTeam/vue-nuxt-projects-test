// const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => ({
	apiUrls: {
		root: 'https://api.quwi.com/v2',
		login: '/auth/login'
	},
	auth: null
})

export const getters = {
	getApiUrls: state => state.apiUrls
}

export const mutations = {
	setAuth (state, auth) {
    state.auth = auth
  }
}

export const actions = {
	setAuth ({commit}, auth) {
		commit('setAuth', auth)
	},

	// nuxtServerInit({ commit }, { req }) {
	//  let auth = null
	//   if (req && req.headers && req.headers.cookie) {
	//     const parsed = cookieparser.parse(req.headers.cookie)
	//     try {
	//       auth = JSON.parse(parsed.auth)
	//     } catch (err) {
	//       // No valid cookie found
	//     }
	//   }
	//   commit('setAuth', auth)
	// }
}