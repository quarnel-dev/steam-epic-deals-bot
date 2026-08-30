import { Bot } from 'grammy'

const bot = new Bot(process.env.BOT_TOKEN)

bot.command("start", (ctx) => {
    ctx.reply("Hello World")
})

bot.start()