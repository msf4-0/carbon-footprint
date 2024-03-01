export default { // For category 1 and 2
	dropdownData: async () => {
		const year = year_select.selectedOptionValue
		const scope3Array = await display1_2.run({year});
		
		let uniqueFactor1 = new Set();
		
		scope3Array.forEach(factor => {
		uniqueFactor1.add({label: factor.source, value: factor.id})
		});
												
		let formatSetToArray = (set) => {
    	let array = Array.from(set);
			return array.map(item => ({label: item.label, value: item.value}));
		};
		
		return {
			scope3: formatSetToArray(uniqueFactor1)
		}
	},

	factor: async () => {
		const id = Select9.selectedOptionValue;
		await display1_2_2.run({id});
		Text18.setText("Supply Chain Emission Factor Value with Margins: " + display1_2_2.data[0].factor)
	},
	
	calculate: async() => {
		let input = Input5.text
		let value = Text18.text
		let match = value.match(/\d+/)
		
		if (match) {
			const number = parseFloat(match[0]);
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