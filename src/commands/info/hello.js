const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
module.exports={
    name: "hello",
    category: "info",
    run: async ({client, message, args}) =>{
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);
            
            const row1 = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
            .setCustomId('select')
            .setPlaceholder('Nothing selected')
            .addOptions([
                {
                    label: 'Select me',
                    description: 'This is a description',
                    value: 'first_option',
                },
                {
                    label: 'You can select me too',
                    description: 'This is also a description',
                    value: 'second_option',
                },
            ]),
			);
        message.reply({ content: `Hello ${message.author} :D`, components: [row] })
        message.reply({ content: `.`, components: [row1] })
        
    }
}