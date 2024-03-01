export default {
	run: async () => {
		try{
			jsonwebtoken.verify(appsmith.store.token, 'secret');
		} catch (error) {
			return showAlert('Session expired. Please re-login', 'warning')
			.then(() => appsmith.mode === "EDIT"? '': navigateTo('Login Page'))
		}
	},
	createHash: (password) =>{ // takes password as the input 
		return dcodeIO.bcrypt.hashSync(password,10); //generate a hash of the password, uses 10 factor during the hashing
	},
	verifyHash: (password, hash) => {
		return dcodeIO.bcrypt.compareSync(password, hash); 
		// return bool
	},
	removeCountryCode: (contact, country) => {
		if (contact.startsWith(country))
			{
				return contact.slice(country.length).toString();
			}
		else
			{
				return contact.toString();
			}
	},
	checkpass: async() => {
		const oldpass = pass1.text;
		const newpass1 = pass2.text;
		const newpass2 = pass22.text;
		
		if (this.verifyHash(oldpass, getUsers.data[0].password)){
			const pHash = this.createHash(newpass1);
			return changepass.run({pHash})
			.then(() => showAlert("Password changed successfully", "success"));
		}
		else {
			showAlert("Wrong old password", 'error');
		}
	},
	dialno: () => {
		const country = getUsers.data[0].countryCode.toString();
		const phone = getUsers.data[0].contact_no.toString();
		
		return this.removeCountryCode(phone,country);
	},
}