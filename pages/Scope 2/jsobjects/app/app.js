export default {
	visible_data: false,
	disable_save: true,
	import_s1: true,
	table_s1: false,

	run: async () => {
		try{
			jsonwebtoken.verify(appsmith.store.token, 'secret');
		} catch (error) {
			return showAlert('Session expired. Please re-login', 'warning')
			.then(() => appsmith.mode === "EDIT"? '': navigateTo('Login Page'))
		}
	},

	onClick1: async () => {
		this.import_s1 = false;
		this.table_s1 = true;
	},

	onClick2: async () => {
		const jsonData = FilePicker1.files[0].data
		const categories = categories_input.selectedOptionLabel
		const modifiedData = jsonData.map(item => ({
			timestamp: item.timestamp,
			year: parseFloat(item.timestamp.match(/\d{4}/)),
  		scope: "Scope 2",
			categories: categories,
			value_kgco2e: item.value_kgco2e
		}));

		this.import_s1 = true;
		this.table_s1 = false;
		let timestamp = this.formatDate();
		let user = appsmith.store.user
		let action = "Imported data for Scope 2"
		
		import_s2.run({modifiedData})
		.then(() => showAlert("Imported successfully", 'success'))
		.then(() => insert_log.run({timestamp, action, user}))
		.then(() => displaycalc2.run())
		.then(() => resetWidget('import_form1', true))
	},

	visible :() => {
		if (!Select1.selectedOptionValue || !year_select.selectedOptionValue)
			{
				this.visible_data = false;
				this.dropdownData()
				showAlert('Please select a category for Scope 2', 'info')
			}
		else 
			{
				this.visible_data = true;
				this.dropdownData()
			}
	},
	dropdownData: async () => {
		const year = year_select.selectedOptionValue
		const scope2Array = await displayef.run({year});
		
		let uniqueFactor1 = new Set();

		scope2Array.forEach(factor => {
			let combine = factor.source + " - " +factor.co2e + " (" + factor.unit + ")";
			uniqueFactor1.add({label: combine, value: factor.id, value2: factor.co2e});
		});

		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.value2}));
		};
		
		return {
			scope2: formatSetToArray(uniqueFactor1)
		};
	},
	unit: async () => {
		let id = Select9Copy.selectedOptionValue
		await displayef2.run({id});
		let unit = displayef2.data[0].unit.match(/\/(.+)/)
		
		if (unit){
			Text19.setText(unit[1])
		}
		else {
			Text19.setText("")
		}
	},
	calculate: () =>{
		const input = Input5Copy.text;
		let factor = Select9Copy.selectedOptionLabel;
		let match = factor.match(/- (\d+(\.\d+)?)/);
		
		if (match) {
			const number = parseFloat(match[1]);
			let answer = input * number;
			answer = answer.toFixed(2)
			Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
			value_calc.setText(answer.toString())
			storeValue('calc_scope2', answer, false)
			this.disable_save = false;
		}
		else {
			value_calc.setText("");
			this.disable_save = true;
		}
	},
	unitcalculate: () => {
		let value = Select3.selectedOptionValue;
		let calc = value_calc.text;
		
		if (calc != "")
			{
				this.disable_save = false;
				if (value === '1'){
					calc = appsmith.store.calc_scope2 / 1000;
					value_calc.setText(calc.toString());
				}
				else if (value === '3'){
					calc = appsmith.store.calc_scope2 * 1000;
					value_calc.setText(calc.toString());
				}
				else {
					value_calc.setText(appsmith.store.calc_scope2.toString());
				}
			}
		else{
			this.disable_save = true;
			value_calc.setText("");
		}
	},

	formatDate: () => {
		const now = new Date();
		const gmtDate = new Date(now.getTime() + 8 * 60 * 60 * 1000); // Convert offset to milliseconds
		const year = gmtDate.getUTCFullYear();
		const month = String(gmtDate.getUTCMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
		const day = String(gmtDate.getUTCDate()).padStart(2, '0');
		const hours = String(gmtDate.getUTCHours()).padStart(2, '0');
		const minutes = String(gmtDate.getUTCMinutes()).padStart(2, '0');
		const seconds = String(gmtDate.getUTCSeconds()).padStart(2, '0');
		
		const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		return formattedDate
	},

	save: async () => {
		const formattedDate = this.formatDate();
		const dateComponents = formattedDate.split(' ')[0].split('-');
		const year2 = dateComponents[0];
		const formattedDate2 = `${year2}`;
		let value = appsmith.store.calc_scope2

		save_calc.run({formattedDate, formattedDate2, value})
		.then(() => displaycalc2.run())
		.then(() => showAlert('Saved your Scope 2 calculation', 'success'))
		.then(() => value_calc.setText(""))
		.then(() => storeValue('calc_scope2', 0, false))
		
		let action = "Save a new calculation for Scope 1";
		let user = appsmith.store.user;
		insert_log.run({formattedDate, action, user})		
	},
	log: (action) => {
		const timestamp = this.formatDate()
		const user = appsmith.store.user
		
		return insert_log.run({timestamp, action, user})
	},
}