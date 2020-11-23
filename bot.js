require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const cc = require('currency-codes');
const Markup = require('telegraf/markup');


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name}!
Узнай курс валют Нац.банка Беларуси.
Введи на английском валюту заглавными буквами (PLN, UAH, GBP) и увидишь курс за сегодня.`,
Markup.keyboard([
    ['USD','EUR','RUB'],
])
.resize()
.extra()
)
);



bot.help((ctx) => ctx.reply('Send me a sticker for fun'))

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
                const currObj=await axios.get('https://developerhub.alfabank.by:8273/partner/1.0.0/public/nationalRates')
           const foundCurrency = currObj.data.rates.find((cur)=>{
         return cur.code.toString() === currency.number;
        });
           // !foundCurrency.sellRate || !foundCurrency.buyRate
        if(!foundCurrency.rate){
            return ctx.reply('Валюта не найдена в Нац.банк api');
        }
        return ctx.replyWithMarkdown(`
        Валюта: ${foundCurrency.quantity} ${foundCurrency.name.toString()}
Курс на сегодня: *${foundCurrency.rate}* `);
        }catch(error){
            return ctx.reply(error)
         }
        });
        // ${foundCurrency.quantity} ${foundCurrency.name.toString()}

bot.launch();