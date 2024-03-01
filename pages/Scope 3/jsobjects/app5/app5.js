export default { // For category 3
	unit: () => {
		let type = Select5Copy.selectedOptionValue
    if (type === "Gaseous Fuels" || type === "Liquid Fuel") {
			Select10.setDisabled(false)
			Select10.setOptions([
            { label: "tonnes", value: "tonnes" },
            { label: "litres", value: "litres" },
						{ label: "kWh (Gross CV)", value: "kwh"}
        ]);
    } else if (type === "Solid Fuel") {
			Select10.setDisabled(false)
       Select10.setOptions([
            { label: "tonnes", value: "tonnes" },
            { label: "litres", value: "litres" },
						{ label: "kWh (Gross CV)", value: "kwh"}
        ]);
    } else {
			Select10.setDisabled(true)
		}
	},

	dropdownData: async () => {
		if (!Select10.selectedOptionValue || !Select5Copy.selectedOptionValue)
			{
				factor_fuel.setDisabled(true)
			}
		else 
			{
				factor_fuel.setDisabled(false)
			}
		const year = year_select.selectedOptionValue
		const unit = Select10.selectedOptionValue
		const type = Select5Copy.selectedOptionValue
		const scope3Array = await display3.run({type,unit,year});
		
		let uniqueFactor1 = new Set();
		
		scope3Array.forEach(factor => {
			let combine = factor.fuel + " - " +factor.co2e + " (kg)";
			uniqueFactor1.add({label: combine, value: factor.id})
		});
												
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value, constant: item.value2}));
		};
		
		return {
			scope3: formatSetToArray(uniqueFactor1)
		}
	},

	breakdown:async() => {
		const id = factor_fuel.selectedOptionValue
		await display3_2.run({id})
		Text21.setText("CO2: " + display3_2.data[0].co2 + "kg/kg")
		Text22.setText("CH4: " + display3_2.data[0].ch4 + "kg/kg")
		Text23.setText("N2O: " + display3_2.data[0].n2o + "kg/kg")
	},

	calculate: async() => {
		let input = Input1Copy.text
		let factor = factor_fuel.selectedOptionLabel
		let match = factor.match(/- (\d+(\.\d+)?)/);
		
		if (match) {
			const number = parseFloat(match[1]);
			let answer = input * number
			answer = answer.toFixed(2);
			Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
			value_calc.setText(answer.toString())
			storeValue('calc_scope3', answer, false)
			app.disable_save = false;		
		}
		else {
			value_calc.setText("");
			app.disable_save = true;		
		}		
	},
}