module.exports = async (bot, guild) => {
	if (guild.name == undefined) return;
	console.log(`${bot.user.username} Left a server! \n${guild.name}: ${guild.id}`)
	await bot.db.delete(guild.id);
	const a = await bot.db.get("premium_status." + guild.id)
	let amt = Number(a) - 1;
	let bmf = Number(a);
	if (a) {
		await bot.db.set(`premium_count.${a}`, amt)
		await bot.db.delete("premium_status." + guild.id)
		return;
	}
};
