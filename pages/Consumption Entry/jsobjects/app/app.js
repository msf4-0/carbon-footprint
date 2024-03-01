export default {
	run: async () => {
		try{
			jsonwebtoken.verify(appsmith.store.token, 'secret');
		} catch (error) {
			return showAlert('Session expired. Please re-login', 'warning')
			.then(() => appsmith.mode === "EDIT"? '': navigateTo('Login Page'))
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
	unit: async() => {
    let energy = energy_type.selectedOptionValue;

    if (energy === 1) {
        return JSON.stringify([
            { label: "kWh", value: 1 },
            { label: "MWh", value: 2 },
						{ label: "GWh", value: 3}
        ]);
    } else {
        return JSON.stringify([
            { label: "L", value: 1 },
            { label: "m3", value: 2 }
        ]);
    }
	},
	unit2: async() => {
    let categories = categories_waste.selectedOptionValue;

    if (categories === 'Radioactive Waste') {
        return JSON.stringify([
            { label: "kg", value: 1 },
            { label: "tonnes", value: 2 },
						{ label: "Bq", value: 3},
						{ label: "Ci", value: 4},
        ]);
    } else {
        return JSON.stringify([
            { label: "kg", value: 1 },
            { label: "tonnes", value: 2 }
        ]);
    }
	},
	disable: () => {
		if (!energy_type.selectedOptionValue){
			return true;
		}
		else {
			return false
		}
	},
	disable2: () => {
		if (!categories_waste.selectedOptionLabel){
			return true;
		}
		else {
			return false
		}
	},
	submit_energy: () => {
		let formattedDate = this.formatDate()
		let id = this.increment_energy()
		let action = "Save a new data entry for Energy Consumption (id: "+ id + ")"
		let user = appsmith.store.user11

		submit_energy.run()
		.then(() => showAlert('Successfully inserted data entry for Energy Consumption', 'success'))
		.then(() => unit_energy.setDisabled(true))
		.then(() => insert_log.run({formattedDate, action, user}))
		.then(() => Select_cms_energy1.run())
		.then(() => resetWidget('Form1', true))
	},
	submit_waste: () => {		
		let formattedDate = this.formatDate()
		let id = this.increment_waste()
		let action = "Save a new data entry for Waste Generated (id: "+ id + ")"
		let user = appsmith.store.user
		
		submit_waste.run()
		.then(() => showAlert('Successfully inserted data entry for Waste Generated', 'success'))
		.then(() => unit_waste.setDisabled(true))
		.then(() => insert_log.run({formattedDate, action, user}))
		.then(() => Select_cms_waste1.run())
		.then(() => resetWidget('Form1Copy1', true))
	},
	calculation_energy:() => {
		let value1 = input_energy.text
		let value2 = output_energy.text
		if (!(value1) || !(value2) || value2 === 0){
			return " "
		}
		else {
			let intensity = value1/value2;
			return intensity.toFixed(2)
		}
	},
	unit_energy:() => {
		let unit1 = unit_energy.selectedOptionLabel
		let unit2 = unit_outputenergy.selectedOptionLabel
		if (!unit_energy.selectedOptionValue || !unit_outputenergy.selectedOptionValue){
			let res = ""
			return res
		}
		else {
			let res = unit1 + "/" + unit2
			return res
		}
	},
	calculation_waste:() => {
		let value1 = input_waste.text
		let value2 = output_waste.text
		let intensity = value1/value2;
		if (!value1 || !value2 || value2 === 0){
			return ""
		}
		else {
			return intensity.toFixed(2)
		}
	},
	unit_waste:() => {
		let unit1 = unit_waste.selectedOptionLabel
		let unit2 = unit_outputwaste.selectedOptionLabel
		if (!unit_waste.selectedOptionValue || !unit_outputwaste.selectedOptionValue){
			let res = ""
			return res
		}
		else {
			let res = unit1 + "/" + unit2
			return res
		}
	},
	increment_energy: async () =>{
		await maxID_energy.run()
		let id = maxID_energy.data[0].max_id + 1
		return id
	},
	increment_waste: async () =>{
		await maxID_waste.run()
		let id = maxID_waste.data[0].max_id + 1
		return id
	},
	update_energy: async() => {
		let intensity = Table3.updatedRow.input / Table3.updatedRow.output
		let intensity_unit = Table3.updatedRow.input + "/" + Table3.updatedRow.output
		
		Update_cms_energy1.run({intensity,intensity_unit})
		.then(() => showAlert('Successfully edited the data entry for energy consumption', 'success'))
		.then(() => Select_cms_energy1.run())
	},
	update_waste: async() => {
		let intensity = Table3Copy.updatedRow.input / Table3Copy.updatedRow.output
		let intensity_unit = Table3Copy.updatedRow.input + "/" + Table3Copy.updatedRow.output
		
		Update_cms_waste1.run({intensity,intensity_unit})
		.then(() => showAlert('Successfully edited the data entry for waste generated', 'success'))
		.then(() => Select_cms_waste1.run())
	},
	import_energy: async () => {
		const jsonData = FilePicker1.files[0].data
		const modifiedData = jsonData.map(item => ({
			type: item.type,
			date: item.date,
			input: item.input,
			input_unit: item.input_unit,
			output: item.output,
			output_unit: item.output_unit,
			intensity: item.input / item.output,
			intensity_unit: item.input_unit + "/" + item.output_unit
		}));
		
		let timestamp = this.formatDate();
		let user = appsmith.store.user
		let action = "Imported data for Entry of Resource Comsumption"
		
		import_energy.run({modifiedData})
		.then(() => showAlert("Imported successfully", 'success'))
		.then(() => insert_log.run({timestamp, action, user}))
		.then(() => Select_cms_energy1.run())
		.then(() => closeModal('Modal1'))
		.then(() => resetWidget('FilePicker1'));
	},
	import_waste: async () => {
		const jsonData = FilePicker2.files[0].data
		const modifiedData = jsonData.map(item => ({
			categories: item.categories,
			date: item.date,
			input: item.input,
			input_unit: item.input_unit,
			output: item.output,
			output_unit: item.output_unit,
			intensity: item.input / item.output,
			intensity_unit: item.input_unit + "/" + item.output_unit
		}));
		
		let timestamp = this.formatDate();
		let user = appsmith.store.user
		let action = "Imported data for Entry of Waste Generated"
		
		import_waste.run({modifiedData})
		.then(() => showAlert("Imported successfully", 'success'))
		.then(() => insert_log.run({timestamp, action, user}))
		.then(() => Select_cms_waste1.run())
		.then(() => closeModal('Modal2'))
		.then(() => resetWidget('FilePicker2'));
	},
}
