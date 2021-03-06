const { Command } = require('discord-akairo');
const { inspect } = require('util');

module.exports = class Util extends Command {
	constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			ownerOnly: true,
			category: 'Utility',
			typing: true,
			cooldown: 1500,
			quoted: false,
			args: [
				{ id: 'code', match: 'content' }
			]
		});
	}

	inspect(obj, options) {
		return inspect(obj, options);
	}

	codeBlock(str, lang = 'js') {
		return [
			`\`\`\`${lang}`,
			str, '```'
		].join('\n');
	}

	async exec(message, args) {
		const { guild, channel } = message;
		const code = args.code;
		const asynchronous = code.includes('await') || code.includes('return');
		let before, evaled, evalTime, type, token, result;

		before = Date.now();
		try {
			evaled = await eval(asynchronous ? `(async()=>{${code}})()` : code);
		} catch(error) {
			evaled = error.message;
		}
		evalTime = Date.now() - before;
		type = typeof evaled;

		if (type !== 'string') {
			evaled = this.inspect(evaled, { depth: 0 });
		}

		token = new RegExp(this.client.token, 'gi');
		evaled = evaled.replace(token, 'N0.T0K4N.4Y0U');
		await channel.send({ embed: {
			color: 'ORANGE',
			description: this.codeBlock(evaled),
			fields: [
				{ name: 'Type', value: this.codeBlock(type) },
				{ name: 'Latency', value: this.codeBlock(`${evalTime}ms`) }
			]
		}});
	}
}