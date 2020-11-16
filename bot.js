require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');
const Markup = require('telegraf/markup');

 
const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!`,
Markup.keyboard([
    ['Alfa-bank', 'НБ'],
    ['Приорбанк','Беларусбанк'],
])
.resize()
.extra()
)
);
// bot.on ('text', (ctx)=>{
//     let data = {};
//     data = api.getsmth;
//     ctx.reply(data);
// https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates
// })

bot.help((ctx) => ctx.reply('Send me a sticker'))

bot.hears(/^[A-Z]+$/i, async(ctx) => {
   var request = require("request");
var options = { method: 'GET',
  url: 'https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates' };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(response);
})
});
bot.on('sticker', (ctx) => ctx.reply('👍'))
// bot.hears(/^[A-Z]+$/i, async(ctx) => {
//     const clientCurCode = ctx.message.text;
//     const currency = cc.code(clientCurCode);
//     console.log(currency);
// //checking if currency exist
//     if (!currency){
//         return ctx.reply('Валюта не найдена');
//     }
//     try{
//         const currencyObj = await axios.get('https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates')
   
//    const foundCurrency = currencyObj.data.find((cur)=>{
//        return cur.sellCode === currency.number;
//    });
//    if(!foundCurrency || !foundCurrency.rates.sellRate || !foundCurrency.rates.buyRate){
//        return ctx.reply('Currency didnt found in Alfa-bank api');
//    }
//         return ctx.replyWithMarkdown(
//            `
//             Валюта: ${currency.rates}
//             Rate sell: *${foundCurrency.rates.sellRate}*
//             Rate buy: *${foundCurrency.rates.buyRate}*
//            ` );
//     }catch(error){
//         return ctx.reply(error);
//     }
// }
// );
bot.launch()