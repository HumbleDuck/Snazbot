'use strict'
const glob = require('glob')
const path = require('path');
const Discord = require('discord.js')

const logger = require('./logger.js')
const app = require('../app.js')

var comms = {};

var commcount = 0;
glob.sync('./includes/commands/**/*.js').forEach(function(file) {
	let name = file.replace('./includes/commands/','').replace('.js','');
	comms[name] = require(path.resolve(file));
	commcount++;
});

logger.log('info',`Loaded ${commcount} commands.`);

exports.parse = function(msg){
	let content = msg.content;
	let author = msg.author;
	let found = false;

	let comm = content.split(' ')[0].replace(app.prefix,'');
	let args = content.replace(app.prefix+comm+' ','').split(' ');

	logger.log('info',`Command from ${author.username}: ${msg.content}`)

	for(let command in comms){
		if(comm == command){
			found = true;
			comms[command].main(msg,args)
		}
	}
	if(comm == 'help'){
		found = true;
		help(msg,args);
	}
	if(!found){
		msg.channel.send('Command not found! Try again.')
	}
}

function help(msg,args){
	if(args[0] == '!help' || args[0] == 'help'){
		let rich = new Discord.RichEmbed();
		rich.setTitle('List of commands')
		rich.setDescription(`Use ${app.prefix}help <command> for a more detailed description.`)
		for(let command in comms){
			let desc;
			if(typeof(comms[command].description)!== 'undefined'){
				desc = comms[command].description;
			}else{
				desc = 'No description profided';
			}
			rich.addField(app.prefix+command,`*${desc}*`,true);
		}
		msg.channel.send(rich)
	}else{
		let found = false;
		let rich = new Discord.RichEmbed();
		for(let command in comms){
			let com = args[0].replace(app.prefix,'');
			if(com == command){
				found = true;
				rich.setTitle(`Usage info for ${com}`);
				rich.setDescription(comms[com].usage);
				msg.channel.send(rich);
			}
		}
		if(!found){
			msg.channel.send('Could not find a command that matches that! Please try again.')
		}
	}
}