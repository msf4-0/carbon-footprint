export default {
	submit: () => {
		if (Switch1.isSwitchedOn === false && Switch2.isSwitchedOn === false)
			{
				return true;
			}
		else 
			{
				return false;
			}
	},

	new: () => {
		if (Select1.selectedOptionLabel === "Stationary Combustion")
			{
				showModal('Modal2')
			}
		else if (Select1.selectedOptionLabel === "Mobile Combustion")
			{
				showModal('Modal3')
			}
		else if (Select1.selectedOptionLabel === "Process Emission" || Select1.selectedOptionLabel === "Fugitive Emission")
			{
				showModal('Modal4')
			}
		else 
			{
				showAlert('Please select a Scope 1 Category to proceed', 'error')
			}		
	},
	
	emission2_mass: async () => {
		const co2 = Input16.text;
		const ch4 = Input17.text;
		const n2o = Input18.text;
		
		let id = Select10.selectedOptionValue;
		const gwp = await gwp_select2.run({id})
		const co2e = ((co2 * gwp[0].co2) + (ch4 * gwp[0].ch4) + (n2o * gwp[0].n2o))
		return co2e;				
	},

	emission2_energy: async () => {
		const co2 = Input8.text;
		const ch4 = Input9.text;
		const n2o = Input10.text;
		
		let id = Select10.selectedOptionValue;
		const gwp = await gwp_select2.run({id})
		const co2e = ((co2 * gwp[0].co2) + (ch4 * gwp[0].ch4) + (n2o * gwp[0].n2o))
		return co2e;	
	},
	
	choose:() => {
		const formattedDate = app.formatDate();
		let user = appsmith.store.user;	
		if (Select1.selectedOptionLabel === "Process Emission")
			{
				let action = "Created a new emission factor for Scope 1 Process Emission";
				insert_pe.run().then(() => showAlert('Successfully created a new emission factor for Scope 1 Process Emission', 'success'))
				.then(() => insert_log.run({formattedDate, action, user}))
			}
		else
			{
				let action = "Created a new emission factor for Scope 1 Fugitive Emission";				
				insert_fe.run().then(() => showAlert('Successfully created a new emission factor for Scope 1 Fugitive Emission', 'success'))
				.then(() => insert_log.run({formattedDate, action, user}))
			}
	},

}