export default {
	visible_1: false,
	visible_2: false,
	visible_3: false,
	visible_4: false,
	visible_5: false,
	visible_6: false,
	visible_calc: false,
	visible_dist: false,
	visible_year: false,
	visible_efficiency: false,
	visible_year2: false,
	visible_dist2: false,
	visible_efficiency2: false,
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
  		scope: "Scope 3",
			categories: categories,
			value_kgco2e: item.value_kgco2e
		}));

		this.import_s1 = true;
		this.table_s1 = false;
		let timestamp = this.formatDate();
		let user = appsmith.store.user
		let action = "Imported data for Scope 3"
		
		import_s3.run({modifiedData})
		.then(() => showAlert("Imported successfully", 'success'))
		.then(() => insert_log.run({timestamp, action, user}))
		.then(() => displaycalc3.run())
		.then(() => resetWidget('import_form1', true))
	},
	
	year: () => {
		if (Select1.selectedOptionValue === 5 || Select1.selectedOptionValue === 12)
		{
			app1.dropdownData_5_12()
		}
		else if (Select1.selectedOptionValue === 6 || Select1.selectedOptionValue === 7)
		{
			app2.dropdown_fuel()
			app2.dropdown_type()
		}
		else if (Select1.selectedOptionValue === 4 || Select1.selectedOptionValue === 9)
		{
			app3.dropdown_fuel()
			app3.dropdown_type()
		}
		else if (Select1.selectedOptionValue === 1 || Select1.selectedOptionValue === 2)
		{
			app4.dropdownData()
		}
		else if (Select1.selectedOptionValue === 3)
		{
			app5.dropdownData()
		}
		else if (Select1.selectedOptionValue === 8 || Select1.selectedOptionValue === 10 || Select1.selectedOptionValue === 11 || 
						 Select1.selectedOptionValue === 13 || Select1.selectedOptionValue === 14 || Select1.selectedOptionValue === 15)
		{
			app6.select_dropdown()
		}
		else 
		{
			showAlert('Please select a category for Scope 3', 'info')
		}
	},
	
	visible: () => {
		// Category 5 & 6
		if (!Input2.text || Input3.text !== null){
			this.visible_efficiency = true;
		}
		else {
			this.visible_efficiency = false;
		}
		if (!Select7.selectedOptionLabel){
			this.visible_year = true;
			this.visible_dist = true;
		}
		else {
			this.visible_year = false;
			this.visible_dist = false;
		}
		// Category 4 & 9
		if (!Input2Copy.text || Input3Copy.text !== null){
			this.visible_efficiency2 = true;
		}
		else {
			this.visible_efficiency2 = false;
		}
		if (!Select7Copy.selectedOptionLabel){
			this.visible_year2 = true;
			this.visible_dist2 = true;
		}
		else {
			this.visible_year2 = false;
			this.visible_dist2 = false;
		}
		if (Select1.selectedOptionValue === 5 || Select1.selectedOptionValue === 12)
			{
				value_calc.setText("")
				this.visible_1 = true;
				this.visible_calc = true;
				this.visible_2 = false;
				this.visible_3 = false;
				this.visible_4 = false;
				this.visible_5 = false;
				this.visible_6 = false;
			}
		else if (Select1.selectedOptionValue === 6 || Select1.selectedOptionValue === 7)
			{	
				value_calc.setText("")
				this.visible_1 = false;
				this.visible_calc = true;
				this.visible_2 = true;
				this.visible_3 = false;
				this.visible_4 = false;
				this.visible_5 = false;
				this.visible_6 = false;
			}
		else if (Select1.selectedOptionValue === 4 || Select1.selectedOptionValue === 9)
			{
				value_calc.setText("")
				this.visible_1 = false;
				this.visible_calc = true;
				this.visible_2 = false;
				this.visible_3 = true;
				this.visible_4 = false;					
				this.visible_5 = false;
				this.visible_6 = false;
			}
		else if (Select1.selectedOptionValue === 1 || Select1.selectedOptionValue === 2)
			{
				value_calc.setText("")
				this.visible_1 = false;
				this.visible_calc = true;
				this.visible_2 = false;
				this.visible_3 = false;
				this.visible_4 = true;
				this.visible_5 = false;
				this.visible_6 = false;
			}
		else if (Select1.selectedOptionValue === 3)
			{
				value_calc.setText("")
				this.visible_1 = false;
				this.visible_calc = true;
				this.visible_2 = false;
				this.visible_3 = false;
				this.visible_4 = false;			
				this.visible_5 = true;
				this.visible_6 = false;	
			}
		else if (Select1.selectedOptionValue === 8 || Select1.selectedOptionValue === 10 || Select1.selectedOptionValue === 11 || 
						 Select1.selectedOptionValue === 13 || Select1.selectedOptionValue === 14 || Select1.selectedOptionValue === 15)
			{
				value_calc.setText("")
				this.visible_1 = false;
				this.visible_calc = true;
				this.visible_2 = false;
				this.visible_3 = false;
				this.visible_4 = false;		
				this.visible_5 = false;
				this.visible_6 = true;						
			}
		else 
			{
				resetWidget('Container3',true)
				this.visible_1 = false;
				this.visible_calc = false;
				this.visible_2 = false;
				this.visible_3 = false;
				this.visible_4 = false;	
				this.visible_5 = false;
				this.visible_6 = false;			
			}
	},
	
	unit_calculate: async () => {
		let value = Select3.selectedOptionValue;
		let calc = parseFloat(appsmith.store.calc_scope3);
		
		if (calc != "")
			{
				app.disable_save = false;		
				if (value === '1'){
					calc = calc / 1000;
					value_calc.setText(calc.toString());
				}
				else if (value === '3'){
					calc = calc * 1000;
					value_calc.setText(calc.toString());
				}
				else {
					value_calc.setText(calc.toString());
				}
			}
		else
		{
			app.disable_save = true;		
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
		let value = appsmith.store.calc_scope3

		save_calc.run({formattedDate, formattedDate2, value})
		.then(() => displaycalc3.run())
		.then(() => showAlert('Saved your Scope 3 calculation', 'success'))
		.then(() => value_calc.setText(""))
		.then(() => storeValue('calc_scope3', 0, false))
		
		let action = "Save a new calculation for Scope 3";
		let user = appsmith.store.user;
		insert_log.run({formattedDate, action, user})		
	},

	log: (action) => {
		const timestamp = this.formatDate()
		const user = appsmith.store.user
		
		return insert_log.run({timestamp, action, user})
	},
}