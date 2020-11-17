require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');
const Markup = require('telegraf/markup');
//const { oneTime } = require('telegraf/markup');

//const api = axios.get('https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates');

 
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
//  bot.on ('text', (ctx)=>{
//     let data = {}
//     data = api.get('rates'); 
//      ctx.reply(data);
//  });


bot.help((ctx) => ctx.reply('Send me a sticker'))

// bot.hears(/^[A-Z]+$/i,(ctx) => {
//    var request = require("request");
// var options = { method: 'GET',
//   url: 'https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates'};

// request(options, function (error, response, body) {
//   // if (error) throw new Error(error);

//  ctx.reply(body);
// })
// });
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
if(!foundCurrency || !foundCurrency.sellRate || !foundCurrency.buyRate){
    return ctx.reply('Валюта не найдена в Alfa-bank api');
}
return ctx.replyWithMarkdown(`
Валюта: ${currency.code}
Курс покупки: *${foundCurrency.buyRate}*
Курс продажи: *${foundCurrency.sellRate}*
`);
}catch(error){
    return ctx.reply(error)
 }
});

bot.launch();