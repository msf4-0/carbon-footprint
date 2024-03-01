export default {
	visible_sc: false,
	visible_mc: false,
	visible_pe: false,
	visible_fe: false,
	visible_calc: false,
	visible_year: false,
	visible_efficiency: false,
	visible_dist: false,
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
  		scope: "Scope 1",
			categories: categories,
			value_kgco2e: item.value_kgco2e
		}));

		this.import_s1 = true;
		this.table_s1 = false;
		let timestamp = this.formatDate();
		let user = appsmith.store.user
		let action = "Imported data for Scope 1"
		
		import_s1.run({modifiedData})
		.then(() => showAlert("Imported successfully", 'success'))
		.then(() => insert_log.run({timestamp, action, user}))
		.then(() => displaycalc1.run())
		.then(() => resetWidget('import_form1', true))
	},

	year:() => {
		if (Select1.selectedOptionLabel === "Stationary Combustion")
			{
				this.dropdownData_sc()
				insert.submit()
			}
		else if (Select1.selectedOptionLabel === "Mobile Combustion")
			{
				this.dropdown_fuel()
				this.dropdown_type()
			}
		else if (Select1.selectedOptionLabel === "Process Emission")
			{
				this.dropdownData_pe()			
			}
		else if (Select1.selectedOptionLabel === "Fugitive Emission")
			{
				this.dropdownData_fe()
			}
		else 
			{
				showAlert('Please select a category for Scope 1', 'info')
			}
	},
	visible :() => {
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
		
		if (Select1.selectedOptionValue === "Stationary Combustion" && !(!year_select.selectedOptionValue))
			{
				this.visible_sc = true;
				this.visible_mc = false;
				this.visible_pe = false;
				this.visible_fe = false;
				this.visible_calc = true;
				value_calc.setText("")
			}
		else if (Select1.selectedOptionValue === "Mobile Combustion" && !(!year_select.selectedOptionValue))
			{
				this.visible_sc = false;
				this.visible_mc = true;
				this.visible_pe = false;
				this.visible_fe = false;
				this.visible_calc = true;
				value_calc.setText("")
			}
		else if (Select1.selectedOptionValue === "Process Emission" && !(!year_select.selectedOptionValue))
			{
				this.visible_sc = false;
				this.visible_mc = false;
				this.visible_pe = true;
				this.visible_fe = false;
				this.visible_calc = true;
				value_calc.setText("")
			}
		else if (Select1.selectedOptionValue === "Fugitive Emission" && !(!year_select.selectedOptionValue))
			{
				this.visible_sc = false;
				this.visible_mc = false;
				this.visible_pe = false;
				this.visible_fe = true;
				this.visible_calc = true;
				value_calc.setText("")
			}
		else 
		{
				this.visible_sc = false;
				this.visible_mc = false;
				this.visible_pe = false;
				this.visible_fe = false;
				this.visible_calc = false;
				value_calc.setText("")
		}
	},
	
	dropdownData_sc: async () => {
		const year = year_select.selectedOptionValue
		const scope1Array = await display_sc.run({year});
		
		let uniqueFactor1 = new Set();
		
		if (type_sc.selectedOptionValue === "Energy"){
			scope1Array.forEach(factor => {
			let combine = factor.source + " - " +factor.co2e_energy + " (" + factor.unit_energy + ")";
			uniqueFactor1.add({label: combine, value: factor.id, value2: factor.co2e_energy});
			});
		}
		else {
			scope1Array.forEach(factor => {
			let combine = factor.source + " - " +factor.co2e_mass + " (" + factor.unit_mass + ")";
			uniqueFactor1.add({label: combine, value: factor.id, value2: factor.co2e_mass});
			});
		}

		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.value2}));
		};
		
		return {
			scope1: formatSetToArray(uniqueFactor1)
		}
	},
	
	display : async () => {
		const factor = Select5.selectedOptionValue;
		await display_sc2.run({factor});
		
		if (type_sc.selectedOptionValue === "Energy"){
			co2_sc.setText("CO2: " + display_sc2.data[0].co2_energy + display_sc2.data[0].unit_energy);
			ch4_sc.setText("CH4: " + display_sc2.data[0].ch4_energy + display_sc2.data[0].unit_energy);
			n2o_sc.setText("N2O: " + display_sc2.data[0].n2o_energy + display_sc2.data[0].unit_energy);
		// unit_sc.setText(this.extractUnit(display_sc2.data[0].unit));
		}
		else if (type_sc.selectedOptionValue === "Mass"){
			co2_sc.setText("CO2: " + display_sc2.data[0].co2_mass + display_sc2.data[0].unit_mass);
			ch4_sc.setText("CH4: " + display_sc2.data[0].ch4_mass + display_sc2.data[0].unit_mass);
			n2o_sc.setText("N2O: " + display_sc2.data[0].n2o_mass + display_sc2.data[0].unit_mass);			
		}
		else {
			co2_sc.setText("CO2: ");
			ch4_sc.setText("CH4: ");
			n2o_sc.setText("N2O: ");			
		}
	},
	
	dropdown_fuel: async () => {
		const year = year_select.selectedOptionValue
		const dataArray = await display_fuel.run({year});
		let uniqueFuel = new Set ();
		
		dataArray.forEach(fuel => {
			uniqueFuel.add({label: fuel.type, value: fuel.id, co2: fuel.co2, unit: fuel.unit});
		});
		
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.co2, unit: item.unit}));
		};
		
		return {
			scope1: formatSetToArray(uniqueFuel)
		}
	},
	
	fuel_unit: async () => {
		const factor = fuel_select.selectedOptionValue;
		await display_fuel2.run({factor});
		
		Text17Copy.setText(display_fuel2.data[0].unit)
		Text13.setText("CO2: "+ display_fuel2.data[0].co2 + "kg/" + display_fuel2.data[0].unit)
		Text16.setText("km/" + display_fuel2.data[0].unit)
	},
	
	dropdown_type: async () => {
		const dataArray = await display_mc.run();
		let uniqueType = new Set ();
		
		dataArray.forEach(type => {
			uniqueType.add(type.source);
		});
		
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return [
						...array.map(source => ({label: source, value: source}))
				];
		}
		
		return {
			scope1: formatSetToArray(uniqueType)
		}
	},
	
	type_year: async() => {
		const factor = Select7.selectedOptionLabel
		const dataArray = await display_mc2.run({factor});
		let uniqueYear = new Set ();
		
		dataArray.forEach(type => {
			uniqueYear.add(type.range);
		});
		
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return [
						...array.map(range => ({label: range, value: range}))
				];
		}
		
		return {
			scope1: formatSetToArray(uniqueYear)
		}		
	},
	
	type_unit: async() => {
		const factor = Select7.selectedOptionValue;
		const year = Select8.selectedOptionValue;
		await display_mc3.run({factor, year});
		Text12.setText("CH4: "+ display_mc3.data[0].ch4 + "kg/km")
		Text14.setText("N2O: "+ display_mc3.data[0].n2o + "kg/km")
	},
	
	distance: async () => {
		let efficiency = Input4.text
		let fuel = Input2.text 
		let distance = efficiency * fuel
		
		Input3.setValue(distance)
		.then(() => resetWidget("Modal1", true))
		.then(() => showAlert("Calculated Distance", 'success'))
		.then(() => closeModal("Modal1"))
	},
	
	dropdownData_fe: async () => {
		const year = year_select.selectedOptionValue
		const scope1Array = await display_fe.run({year});
		
		let uniqueFactor1 = new Set();
		
		scope1Array.forEach(factor => {
		uniqueFactor1.add({label: factor.gas, value: factor.id, value2: factor.value})
		});
												
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.value2}));
		};
		
		return {
			scope1: formatSetToArray(uniqueFactor1)
		}
	},
	
	gwp_fe: async () => {
		const id = Select9Copy.selectedOptionValue;
		await display_fe2.run({id});
		Text18Copy.setText("GWP value: " + display_fe2.data[0].value)
	},

	dropdownData_pe: async () => {
		const year = year_select.selectedOptionValue
		const scope1Array = await display_pe.run({year});
		
		let uniqueFactor1 = new Set();
		
		scope1Array.forEach(factor => {
		uniqueFactor1.add({label: factor.gas, value: factor.id, value2: factor.value})
		});
												
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.value2}));
		};
		
		return {
			scope1: formatSetToArray(uniqueFactor1)
		}
	},
	
	gwp_pe: async () => {
		const id = Select9.selectedOptionValue;
		await display_pe2.run({id});
		Text18.setText("GWP value: " + display_pe2.data[0].value)
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
		let value = appsmith.store.calc_scope1

		save_calc.run({formattedDate, formattedDate2, value})
		.then(() => displaycalc1.run())
		.then(() => showAlert('Saved your Scope 1 calculation', 'success'))
		.then(() => value_calc.setText(""))
		.then(() => storeValue('calc_scope1', 0, false))
		.then(() => ButtonGroup1)
		
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