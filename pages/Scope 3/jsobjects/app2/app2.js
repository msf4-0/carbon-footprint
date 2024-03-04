export default { // For category 6 and 7
	fuel_required: false,
	required: () => {
		if (Checkbox1.isChecked === true) 
			{
				this.fuel_required = true;
			}
		else 
			{
				this.fuel_required = false;
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
			scope3: formatSetToArray(uniqueFuel)
		}
	},
	
	fuel_unit: async () => {
		const factor = fuel_select.selectedOptionValue;
		await display_fuel2.run({factor});
		
		if (Checkbox1.isChecked == true)
			{
				Text20.setText(display_fuel2.data[0].unit)
				Text13.setText("CO2: "+ display_fuel2.data[0].co2 + "kg/" + display_fuel2.data[0].unit)
				Text16.setText("km/" + display_fuel2.data[0].unit)				
			}
		else 
			{
				this.type_unit()
			}
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
	
	dropdown_type: async () => {
		const dataArray = await display6_7.run();
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
			scope3: formatSetToArray(uniqueType)
		}
	},
	
	type_year: async() => {
		const factor = Select7.selectedOptionLabel
		const dataArray = await display6_7_2.run({factor});
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
			scope3: formatSetToArray(uniqueYear)
		}		
	},
	
	type_unit: async() => {
		const factor = Select7.selectedOptionValue;
		const year = Select8.selectedOptionValue;
		await display6_7_3.run({factor, year});
		if (Checkbox1.isChecked == false)
			{
				Text13.setText("CO2: " + display6_7_3.data[0].co2 + "kg/km")
			}
		Text12.setText("CH4: "+ display6_7_3.data[0].ch4 + "kg/km")
		Text14.setText("N2O: "+ display6_7_3.data[0].n2o + "kg/km")
	},
	
	calculate: async () => {
		const factor = Select7.selectedOptionValue;
		const year = Select8.selectedOptionValue;
		await display6_7_3.run({factor, year});
		
		let gwp = display6_7_3.data[0].gwp
		await gwp_select3.run({gwp})
		
		if (Checkbox1.isChecked === true)
			{
				let fuel = Input2.text
				let dist = Input3.text
				let co2 = parseFloat(Text13.text.match(/\d+\.\d+/));
				let ch4 = parseFloat(Text12.text.match(/\d+\.\d+/));
				let n2o = parseFloat(Text14.text.match(/\d+\.\d+/));
				
				if (co2 && ch4 && n2o)
					{
						let answer = fuel * co2 + dist * ch4 * gwp_select3.data[0].ch4 + dist * n2o * gwp_select3.data[0].n2o
						answer = answer.toFixed(2);
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)
						app.disable_save = false;						
					}
				else 
					{
						value_calc.setText("");
						app.disable_save = true;
					}
			}
		else 
			{
				let input = Input3.text
				let co2 = parseFloat(Text13.text.match(/\d+\.\d+/));
				let ch4 = parseFloat(Text12.text.match(/\d+\.\d+/));
				let n2o = parseFloat(Text14.text.match(/\d+\.\d+/));
				
				if (co2 && ch4 && n2o)
					{
						let answer = input * display6_7_3.data[0].co2e;
						answer = answer.toFixed(2);					
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)	
						app.disable_save = false;		
					}
				else 
					{
						value_calc.setText("");
						app.disable_save = true;		
					}						
			}
	},
}