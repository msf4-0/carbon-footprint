export default { // For category 8,10,11,13,14,15
	select_dropdown: async () => {
		const year = year_select.selectedOptionValue
		let uniqueFactor1 = new Set();
		if (Select1.selectedOptionValue === 8) // Upstreamed Leased Assets
			{
				const scope3Array = await display8.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
		else if (Select1.selectedOptionValue === 10) // Processing of Sold Products
			{
				const scope3Array = await display10.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
		else if (Select1.selectedOptionValue === 11) // Use of Sold Products
			{
				const scope3Array = await display11.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
		else if (Select1.selectedOptionValue === 13) // Downstream Leased Assets
			{
				const scope3Array = await display13.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
		else if (Select1.selectedOptionValue === 14) // Franchises
			{
				const scope3Array = await display14.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
		else // Investments
			{
				const scope3Array = await display15.run({year});
				scope3Array.forEach(factor => {
					let combine = factor.source + " - " + factor.co2e + "kg"
					uniqueFactor1.add({label: combine, value: factor.id})
				});

				let formatSetToArray = (set) => {
					let array = Array.from(set);
					return array.map(item => ({label: item.label, value: item.value}));
				};

				return {
					scope3: formatSetToArray(uniqueFactor1)
				}
			}
	},
	
	select_breakdown:() => {
		if (Select1.selectedOptionValue === 8 ) // Upstreamed Leased Assets
			{
				this.breakdown8()
			}
		else if (Select1.selectedOptionValue === 10) // Processing of Sold Products
			{
				this.breakdown10()
			}
		else if (Select1.selectedOptionValue === 11) // Use of Sold Products
			{
				this.breakdown11()
			}
		else if (Select1.selectedOptionValue === 13) // Downstream Leased Assets
			{
				this.breakdown13()
			}
		else if (Select1.selectedOptionValue === 14) // Franchises
			{
				this.breakdown14()
			}
		else// Investments
			{
				this.breakdown15()
			}
	},

	breakdown8: async () => {
		const id = Select9Copy.selectedOptionValue
		await display8_2.run({id})
		let unit = display8_2.data[0].unit
		let unit2 = unit.split('/')
		if (display8_2.data[0].co2 != null || display8_2.data[0].ch4 != null || display8_2.data[0].n2o != null)
			{
				Text24.setText("CO2: " + display8_2.data[0].co2 + unit)
				Text25.setText("CH4: " + display8_2.data[0].ch4 + unit)
				Text26.setText("N2O: " + display8_2.data[0].n2o + unit)
				Text19CopyCopy.setText(unit2[unit2.length-1])
			}
		else 
			{
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
				Text19CopyCopy.setText(unit2[unit2.length-1])
			}
	},

	breakdown10: async () => {
		const id = Select9Copy.selectedOptionValue
		await display10_2.run({id})
		let unit = display10_2.data[0].unit
		let unit2 = unit.split('/')
		if (display10_2.data[0].co2 != null || display10_2.data[0].ch4 != null || display10_2.data[0].n2o != null)
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("CO2: " + display10_2.data[0].co2 + display10_2.data[0].unit)
				Text25.setText("CH4: " + display10_2.data[0].ch4 + display10_2.data[0].unit)
				Text26.setText("N2O: " + display10_2.data[0].n2o + display10_2.data[0].unit)
			}
		else 
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
			}
	},

	breakdown11: async () => {
		const id = Select9Copy.selectedOptionValue
		await display11_2.run({id})
		let unit = display11_2.data[0].unit
		let unit2 = unit.split('/')
		if (display11_2.data[0].co2 != null || display11_2.data[0].ch4 != null || display11_2.data[0].n2o != null)
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("CO2: " + display11_2.data[0].co2 + display11_2.data[0].unit)
				Text25.setText("CH4: " + display11_2.data[0].ch4 + display11_2.data[0].unit)
				Text26.setText("N2O: " + display11_2.data[0].n2o + display11_2.data[0].unit)
			}
		else 
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
			}
	},

	breakdown13: async () => {
		const id = Select9Copy.selectedOptionValue
		await display13_2.run({id})
		let unit = display13_2.data[0].unit
		let unit2 = unit.split('/')
		if (display13_2.data[0].co2 != null || display13_2.data[0].ch4 != null || display13_2.data[0].n2o != null)
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("CO2: " + display13_2.data[0].co2 + display13_2.data[0].unit)
				Text25.setText("CH4: " + display13_2.data[0].ch4 + display13_2.data[0].unit)
				Text26.setText("N2O: " + display13_2.data[0].n2o + display13_2.data[0].unit)
			}
		else 
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
			}
	},

	breakdown14: async () => {
		const id = Select9Copy.selectedOptionValue
		await display14_2.run({id})
		let unit = display14_2.data[0].unit
		let unit2 = unit.split('/')
		if (display14_2.data[0].co2 != null || display14_2.data[0].ch4 != null || display14_2.data[0].n2o != null)
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("CO2: " + display14_2.data[0].co2 + display14_2.data[0].unit)
				Text25.setText("CH4: " + display14_2.data[0].ch4 + display14_2.data[0].unit)
				Text26.setText("N2O: " + display14_2.data[0].n2o + display14_2.data[0].unit)
			}
		else 
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
			}
	},

	breakdown15: async () => {
		const id = Select9Copy.selectedOptionValue
		await display15_2.run({id})
		let unit = display15_2.data[0].unit
		let unit2 = unit.split('/')
		if (display15_2.data[0].co2 != null || display15_2.data[0].ch4 != null || display15_2.data[0].n2o != null)
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("CO2: " + display15_2.data[0].co2 + display15_2.data[0].unit)
				Text25.setText("CH4: " + display15_2.data[0].ch4 + display15_2.data[0].unit)
				Text26.setText("N2O: " + display15_2.data[0].n2o + display15_2.data[0].unit)
			}
		else 
			{
				Text19CopyCopy.setText(unit2[unit2.length-1])
				Text24.setText("")
				Text25.setText("")
				Text26.setText("")
			}
	},
	
	calculate: async() => {
		let input = Input5Copy.text
		let factor = Select9Copy.selectedOptionLabel
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