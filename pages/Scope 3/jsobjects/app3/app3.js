export default { // For category 4 and 9
	fuel_required: false,
	weight_required: false,
	required: () => {
		if (Checkbox2.isChecked === true) 
			{
				this.fuel_required = true;
			}
		else 
			{
				this.fuel_required = false;
			}
		if (Checkbox3.isChecked === true)
			{
				this.weight_required = true;
			}
		else 
			{
				this.weight_required = false;
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
		const factor = fuel_selectCopy.selectedOptionValue;
		await display_fuel2.run({factor});
		
		if (Checkbox2.isChecked == true)
			{
				Text20Copy.setText(display_fuel2.data[0].unit)
				Text13Copy.setText("CO2: "+ display_fuel2.data[0].co2 + "kg/" + display_fuel2.data[0].unit)
				Text16Copy.setText("km/" + display_fuel2.data[0].unit)				
			}
		else 
			{
				this.type_unit()
			}
	},
	
	distance: async () => {
		let efficiency = Input4Copy.text
		let fuel = Input2Copy.text 
		let distance = efficiency * fuel
		
		Input3Copy.setValue(distance)
		.then(() => resetWidget("Modal1Copy", true))
		.then(() => showAlert("Calculated Distance", 'success'))
		.then(() => closeModal("Modal1Copy"))
	},
	dropdown_type: async () => {
		const dataArray = await display4_9.run();
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
		const factor = Select7Copy.selectedOptionLabel
		const dataArray = await display4_9_2.run({factor});
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
		const factor = Select7Copy.selectedOptionValue;
		const year = Select8Copy.selectedOptionValue;
		await display4_9_3.run({factor, year});
		if (Checkbox2.isChecked == false)
			{
				Text13Copy.setText("CO2: " + display4_9_3.data[0].co2 + display4_9_3.data[0].unit)
			}
		Text12Copy.setText("CH4: "+ display4_9_3.data[0].ch4 + display4_9_3.data[0].unit)
		Text14Copy.setText("N2O: "+ display4_9_3.data[0].n2o + display4_9_3.data[0].unit)
	},
	
	calculate: async () => {
		let fuel = Input2Copy.text
		let dist = Input3Copy.text
		let weight = Input6.text
		
		let match1 = Text13Copy.text.match(/\d+\.\d+/);
		let match2 = Text12Copy.text.match(/\d+\.\d+/);
		let match3 = Text14Copy.text.match(/\d+\.\d+/);

		if (Checkbox2.isChecked === true && Checkbox3.isChecked === true)
			{
				if (match1 && match2 && match3)
					{
						let answer = (fuel * match1 + dist * match2 * 25 + dist * match3 * 298) * weight
						answer = answer.toFixed(2);
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)
						app.disable_save = false;		
					}
				else 
					{
						value_calc.setText("")
						app.disable_save = true;		
					}
			}
		else if (Checkbox2.isChecked === true && Checkbox3.isChecked === false)
			{
				if (match1 && match2 && match3)
					{
						let answer = fuel * match1 + dist * match2 * 25 + dist * match3 * 298
						answer = answer.toFixed(2);
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)
						app.disable_save = false;											
					}
				else 
					{
						value_calc.setText("")	
						app.disable_save = true;							
					}				
			}
		else if (Checkbox2.isChecked === false && Checkbox3.isChecked === true)
			{
				if (match1 && match2 && match3)
					{
						let answer = (match1 + dist * match2 * 25 + dist * match3 * 298) * weight
						answer = answer.toFixed(2);
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)		
						app.disable_save = false;									
					}
				else 
					{
						value_calc.setText("")	
						app.disable_save = true;							
					}				
			}
		else 
			{
				if (match1 && match2 && match3)
					{
						let answer = match1 + dist * match2 * 25 + dist * match3 * 298
						answer = answer.toFixed(2);
						Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
						value_calc.setText(answer.toString())
						storeValue('calc_scope3', answer, false)		
						app.disable_save = false;									
					}
				else 
					{
						value_calc.setText("")				
						app.disable_save = true;				
					}				
			}
	},
}