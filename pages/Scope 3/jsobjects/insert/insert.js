export default {
	insert:() => {
		if (Select1.selectedOptionValue === 8 || Select1.selectedOptionValue === 10 || Select1.selectedOptionValue === 11 || 
				Select1.selectedOptionValue === 13 || Select1.selectedOptionValue === 14 || Select1.selectedOptionValue === 15 ||
			  Select1.selectedOptionValue === 6 || Select1.selectedOptionValue === 7) 
		{
			showModal('Modal2')
		}
		else if (Select1.selectedOptionValue === 4 || Select1.selectedOptionValue === 9)
		{
			showModal('Modal3')
		}
		else if (Select1.selectedOptionValue === 1 || Select1.selectedOptionValue === 2)
		{
			showModal('Modal4')
		}
		else if (Select1.selectedOptionValue === 5 || Select1.selectedOptionValue === 12)
		{
			showModal('Modal5')
		}
		else if (Select1.selectedOptionValue === 3)
		{
			showModal('Modal7')
		}
		else 
		{
			showAlert('Please select a Scope 3 category to proceed', 'error')
		}	
	},

	emission2: async () => {
		const co2 = Input26.text;
		const ch4 = Input22.text;
		const n2o = Input23.text;
		
		if (!co2 && !ch4 && !n2o)
			{
				let id = Select11.selectedOptionValue;
				const gwp = await gwp_select2.run({id})
				const co2e = ((co2 * gwp[0].co2) + (ch4 * gwp[0].ch4) + (n2o * gwp[0].n2o))
				return co2e;				
			}
		else 
			{
				Input28.setValue("");
			}
	},

	emission3: async () => {
		const co2 = Input26Copy.text;
		const ch4 = Input22Copy.text;
		const n2o = Input23Copy.text;
		
		if (!co2 && !ch4 && !n2o)
			{
				let id = Select11Copy.selectedOptionValue;
				const gwp = await gwp_select2.run({id})
				const co2e = ((co2 * gwp[0].co2) + (ch4 * gwp[0].ch4) + (n2o * gwp[0].n2o))
				return co2e;				
			}
		else 
			{
				Input28Copy.setValue("");
			}
	},

	emission4: async () => {
		const co2 = Input39.text;
		const ch4 = Input40.text;
		const n2o = Input41.text;
		
		if (!co2 && !ch4 && !n2o)
			{
				let id = Select13.selectedOptionValue;
				const gwp = await gwp_select2.run({id})
				const co2e = ((co2 * gwp[0].co2) + (ch4 * gwp[0].ch4) + (n2o * gwp[0].n2o))
				return co2e;				
			}
		else 
			{
				Input42.setValue("");
			}
	},
	
	choose: () => {
		const formattedDate = app.formatDate();
		let user = appsmith.store.user;			
		if (Select1.selectedOptionValue === 8 )
		{
			let action = "Created a new emission factor for Scope 3 Category 8"
			insert_scope3_8.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 8', 'success'))
			.then(() => insert_log.run({formattedDate, action, user}))
		}
		else if (Select1.selectedOptionValue === 10 )
		{
			let action = "Created a new emission factor for Scope 3 Category 10"
			insert_scope3_10.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 10', 'success'))			
			.then(() => insert_log.run({formattedDate, action, user}))			
		}
		else if (Select1.selectedOptionValue === 11 )
		{
			let action = "Created a new emission factor for Scope 3 Category 11"
			insert_scope3_11.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 11', 'success'))	
			.then(() => insert_log.run({formattedDate, action, user}))					
		}
		else if (Select1.selectedOptionValue === 13 )
		{
			let action = "Created a new emission factor for Scope 3 Category 13"
			insert_scope3_13.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 13', 'success'))			
			.then(() => insert_log.run({formattedDate, action, user}))			
		}
		else if (Select1.selectedOptionValue === 14 )
		{
			let action = "Created a new emission factor for Scope 3 Category 14"
			insert_scope3_14.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 14', 'success'))			
			.then(() => insert_log.run({formattedDate, action, user}))			
		}
		else if (Select1.selectedOptionValue === 15 )
		{
			let action = "Created a new emission factor for Scope 3 Category 15"
			insert_scope3_15.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 15', 'success'))				
			.then(() => insert_log.run({formattedDate, action, user}))		
		}
		else if (Select1.selectedOptionValue === 6 || Select1.selectedOptionValue === 7 )
		{
			let action = "Created a new emission factor for Scope 3 Category 6 and 7"
			insert_scope3_6_7.run().then(() => showAlert('Successfully created a new emission factor for Scope 3 Category 6 and 7', 'success'))						
			.then(() => insert_log.run({formattedDate, action, user}))
		}
	}
}