require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');
const Markup = require('telegraf/markup');


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!
Узнай курс валют Альфа-банка.
Введи на английском валюту (usd, eur, rub) и увидишь курс за сегодня.`,
Markup.keyboard([
    ['USD','EUR','RUB'],
])
.resize()
.extra()
)
);
//  bot.on ('text', (ctx)=>{
//     let data = {}
//     data = api.get('rates'); 
//      ctx.reply(data);
//  });


bot.help((ctx) => ctx.reply('Send me currency code'))

bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.hears(/^[A-Z]+$/i, async(ctx) => {
    const clientCurCode = ctx.message.text;
    const currency = cc.code(clientCurCode);
    console.log(currency);
//checking if currency exist
    if (!currency){
        return ctx.reply('Валюта не найдена');
    }

    try{
const currObj = await axios.get('https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates')
const foundCurrency = currObj.data.rates.find((cur)=>{
 return cur.sellCode.toString() === currency.number;
});
const foundSecondCurrency = currObj.data.rates.find((cur)=>{
    return cur.buyCode.toString() === currency.number;
   });
   // !foundCurrency.sellRate || !foundCurrency.buyRate
if(!foundCurrency && !foundSecondCurrency){
    return ctx.reply('Валюта не найдена в Alfa-bank api');
}
return ctx.replyWithMarkdown(`
Курс: ${foundCurrency.sellIso} - ${foundCurrency.buyIso}
Курс покупки: *${foundCurrency.buyRate}*
Курс продажи: *${foundCurrency.sellRate}*

`);
}catch(error){
    return ctx.reply(error)
 }
});
// ${foundCurrency.quantity} ${foundCurrency.name.toString()}
bot.launch();
