export default {
	generateCode: () => {
		// Generate 6 digits
		const randomDigits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  	return randomDigits;
	},
	formatTime: (timestamp) => {
		const date = new Date(timestamp);
		date.setUTCHours(date.getUTCHours() + 8); // Adjusting for GMT+8
		
  	const year = date.getUTCFullYear();
  	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
 	 	const day = String(date.getUTCDate()).padStart(2, '0');
  	const hours = String(date.getUTCHours()).padStart(2, '0');
  	const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		
		return `${year}.${month}.${day} ${hours}.${minutes}`;
	},
	verification: async() => {
		const email = email_fp.text;	
		const [user] = await finduser.run({email});
		const expirationTime = Date.now() + (10 * 60 * 1000);
		const deadline = this.formatTime(expirationTime);
		
		if (user) {
			let code = this.generateCode();
			return sendCode.run({code, deadline})
			.then (() => storeValue('code', code))
			.then (() => storeValue('time', expirationTime))
			.then (() => storeValue('email', email))
			.then (() => closeModal('Modal1'))
			.then (() => storeValue('currentTab', 'Verification'))
			.then (() => resetWidget('Tabs1'));
		}
		else {
			showAlert('This email is not registered', 'error');
		}
	},
	checkCode: () => {
		const code = appsmith.store.code;
		const time = appsmith.store.time;
		const currentTime = Date.now();
		
		if (code_input.text.toString() === code && currentTime <= time){
			showAlert('Success', 'success')
			.then(() => storeValue('currentTab', 'Change Password'));
		}
		else if (code_input.text.toString() === code && currentTime > time){
			showAlert('The code has expired, send another one', 'error');
		}
		else {
			showAlert('Error, try again', 'error');
		}
	},
	sendAgain: () => {
		const code = this.generateCode();
		const expirationTime = Date.now() + (10 * 60 * 1000);
		const deadline = this.formatTime(expirationTime);
		const phone = appsmith.store.phone;
		
		return sendCode2.run({phone, code, deadline})
		.then (() => storeValue('code', code))
		.then (() => storeValue('time', expirationTime))
		.then (() => showAlert('Please check your SMS', 'success'));
	},
	changePass: () => {
		const password = passchange.text;
		const pHash = app.createHash(password);
		return updatepass.run({pHash})
		.then(() => storeValue('currentTab', 'Sign In'))
	}
}