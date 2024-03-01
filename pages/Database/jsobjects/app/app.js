export default {
	run: async () => {
		try{
			jsonwebtoken.verify(appsmith.store.token, 'secret');
		} catch (error) {
			return showAlert('Session expired. Please re-login', 'warning')
			.then(() => appsmith.mode === "EDIT"? '': navigateTo('Login Page'))
		}
	},
	expandContainer1: false,
	expandContainer2: false,
	expandContainer3: false,
	expandContainer4: false,
	expandContainer5: false,
	expandContainer6: false,
	expandContainer7: false,
	expandContainer8: false,
}