export default {
	createHash: (password) =>{ // takes password as the input 
		return dcodeIO.bcrypt.hashSync(password,10); //generate a hash of the password, uses 10 factor during the hashing 
	},
	verifyHash: (password, hash) => {
		return dcodeIO.bcrypt.compareSync(password, hash); 
		// return bool
	},
	createToken: (email) => {
		return jsonwebtoken.sign({email}, 'secret', {expiresIn: 60*60});
		// The token is signed using the secret key 'secret' and it expires after 1 hour.
	},
	signUp: async () => { // If successful, it shows a success alert, stores a token, and navigates to the home page. If an error occurs, it displays an error alert.
		const firstname = firstname_su.text;
		const lastname = lastname_su.text;
		const countrycode = phone_su.dialCode;
		const contact_no = phone_su.dialCode + phone_su.text;
		const email = email_su.text;
		const password = password_su.text;
		const pHash = this.createHash(password);
		
		const [user] = await finduser.run({email});
		if (user) {
			showAlert('This email has already been registered', 'error')
			.then(() => resetWidget('Form1Copy'))
		}
		else {
			return signup.run({firstname, lastname, contact_no, email, pHash, countrycode})
			.then(() => showAlert('Account created!', 'success'))
			.then(() => storeValue('token', this.createToken(email)))
			.then(() => storeValue('currentTab', 'Sign In'))
			.catch(e => showAlert(e.message, 'error'));
		}
	},
	signIn: async() => {
		const email = email_si.text;
		const password = password_si.text;
		
		const [user] = await finduser.run({email});

		if (user && this.verifyHash(password, user?.password)) {
			if (user.role === "visitor")
				{
					storeValue('token', this.createToken(email))
					.then(() => showAlert('Signed in as visitor', 'success'))
					.then(() => navigateTo('Dashboard Copy'))
				}
			else {
				storeValue('token', this.createToken(email))
				.then(() => storeValue('user', email))
				.then(() => showAlert('Signed in successfully!', 'success'))
				.then(() => navigateTo('Dashboard'))
				.then(() => storeValue('role', user.role))
			}
		}
		else {
			showAlert('Invalid credentials', 'error');
		}
	},
	test: async () => {
		const email = "test@gmail.com";
		const password = "wh20030219";
		
		const [user] = await finduser.run({email});
		if (user) {
			return this.verifyHash(password, user?.password);
		}
	}
}