import Command from '../classes/Command.js'

export default new Command({
	name: 'resume',
	aliases: ['unfreeze'],
	description: 'resume playing the current queue',
	usage: 'command',
	cooldown: 3e3,
	music: true
}, async (bot, message, args) => {

	/** Check Playing State */
	const isPlaying = bot.player.isPlaying(message);
	if (!isPlaying) {
		return 'There\'s nothing playing in the queue.'
	}

	/** Check if paused */
	const paused = bot.player.isPaused(message);
	if (!paused) {
		return 'The player is not paused.'
	}

	/** Else, play */
	try {
		await bot.player.resume(message);
		return 'The player has been resumed.'
	} catch(error) {
		console.error(error)
	}
})