export default { // For category 5 and 12
	dropdownData_5_12: async () => {
		const year = year_select.selectedOptionValue
		const type = type_select.selectedOptionValue
		let uniqueFactor1 = new Set();
		
		if (type === "recycled"){
			Select5.setDisabled(false)
			const scope3Array = await display5_12rec.run({year});
			scope3Array.forEach(factor => {
			let combine = factor.material + " - " +factor.recycled + " (kg/kg)";
			uniqueFactor1.add({label: combine, value: factor.id});
			});
		}
		else if (type === "landfilled"){
			Select5.setDisabled(false)
			const scope3Array = await display5_12land.run({year});
			scope3Array.forEach(factor => {
			let combine = factor.material + " - " +factor.landfilled + " (kg/kg)";
			uniqueFactor1.add({label: combine, value: factor.id});
			});
		}
		else if (type === "combusted"){
			Select5.setDisabled(false)
			const scope3Array = await display5_12comb.run({year});
			scope3Array.forEach(factor => {
			let combine = factor.material + " - " +factor.combusted + " (kg/kg)";
			uniqueFactor1.add({label: combine, value: factor.id});
			});
		}
		else if (type === "composted"){
			Select5.setDisabled(false)
			const scope3Array = await display5_12comp.run({year});
			scope3Array.forEach(factor => {
			let combine = factor.material + " - " +factor.composted + " (kg/kg)";
			uniqueFactor1.add({label: combine, value: factor.id});
			});
		}
		else{
			Select5.setDisabled(true)
		}

		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value}));
		};
		
		return {
			scope3: formatSetToArray(uniqueFactor1)
		}
	},
	
	calculate: async() => {
		let input = Input1.text
		let factor = Select5.selectedOptionLabel
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