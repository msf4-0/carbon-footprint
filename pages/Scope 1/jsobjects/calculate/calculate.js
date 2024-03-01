export default {
	calc_sc: () => {
		let input = Input1.text
		let factor = Select5.selectedOptionLabel
		let match = factor.match(/- (\d+(\.\d+)?)/);
		
		if (match) {
			const number = parseFloat(match[1]);
			let answer = input * number
			answer = answer.toFixed(2);
			Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
			value_calc.setText(answer.toString())
			storeValue('calc_scope1', answer, false)
			app.disable_save = false;		
		}
		else {
			value_calc.setText("");
			app.disable_save = true;		
		}
	},
	
	calc_mc : async () => {
		let fuel = Input2.text
		let dist = Input3.text
		
		let match1 = Text13.text.match(/\d+\.\d+/);
		let match2 = Text12.text.match(/\d+\.\d+/);
		let match3 = Text14.text.match(/\d+\.\d+/);
		
		if (match1 && match2 && match3)
			{
				let answer = fuel * match1 + dist * match2 * 25 + dist * match3 * 298
				answer = answer.toFixed(2);
				Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
				value_calc.setText(answer.toString())
				storeValue('calc_scope1', answer, false)
				app.disable_save = false;		
			}
		else {
			value_calc.setText("");
			app.disable_save = true;		
		}
	},
	
	calc_pe :() => {
		let input = Input5.text
		let gwp = Text18.text.match(/\d+/);
		
		if (gwp){
			let answer = input * gwp
			answer = answer.toFixed(2);
			Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
			value_calc.setText(answer.toString())
			storeValue('calc_scope1', answer, false)
			app.disable_save = false;		
		}
		else {
			value_calc.setText("")
			app.disable_save = true;		
		}		
	},
	
	calc_fe :() => {
		let input = Input5Copy.text
		let gwp = Text18Copy.text.match(/\d+/);
		
		if (gwp){
			let answer = input * gwp
			answer = answer.toFixed(2);
			Select3.setSelectedOption({ label: "kg CO2e", value: "2" })
			value_calc.setText(answer.toString())
			storeValue('calc_scope1', answer, false)
			app.disable_save = false;		
		}
		else {
			value_calc.setText("")
			app.disable_save = true;		
		}
	},
	unitcalculate: () => {
		let value = Select3.selectedOptionValue;
		let calc = value_calc.text;
		
		if (calc != "")
			{
				app.disable_save = false;		
				if (value === '1'){
					calc = appsmith.store.calc_scope1 / 1000;
					value_calc.setText(calc.toString());
				}
				else if (value === '3'){
					calc = appsmith.store.calc_scope1 * 1000;
					value_calc.setText(calc.toString());
				}
				else {
					value_calc.setText(appsmith.store.calc_scope1.toString());
				}
			}
		else{
			app.disable_save = true;		
			value_calc.setText("");
		}
	},
}