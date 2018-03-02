'use strict'
const sleep = require('sleep-promise');

const logger = require('./logger.js');
const app = require('../app.js');

var msgs = exports.msgs = [];

exports.sendMsg = function(msg,content,reply,timeout,callback){
    let sent;
    let push = true;
    if(reply){
		msg.reply(content).then(message => cb(message));//.then(message => sent=message);//
    }else{
		msg.channel.send(content).then(message => cb(message));//.then(message => sent=message);//
    }
    if(!isNaN(timeout) && app.autoclean == 'yes'){
    	push = false;
        sleep(timeout*1000).then(function(){
            sent.delete().catch(function(){logger.log('warn','Tried to delete a nonexistent message!')});
            msg.delete().catch(function(){logger.log('warn','Tried to delete a nonexistent message!')});
        })
    }
    function cb(message){
    	if(push){
	    	msgs.push(message);
	    	msgs.push(msg);
	    }

        if(typeof(callback) !== 'undefined'){
            callback(message);
        }
    }
}

exports.sendChannel = function(chan,content,timeout,callback){
    let sent;
    let push = true;
    
    let all_channels = app.client.channels.array();
    let channel = '';

    for(let c in all_channels){
        if(all_channels[c].id == chan){
            channel = all_channels[c];
        }
    }

    if(channel !== ''){
        channel.send(content).then(message => cb(message));//.then(message => sent=message);//
    }else{
        logger.log('error',`Attempted to send message to nonexistent channel! Channel: ${channel.id}`)
    }
    
    if(!isNaN(timeout) && app.autoclean == 'yes'){
        push = false;
        sleep(timeout*1000).then(function(){
            sent.delete().catch(function(){logger.log('warn','Tried to delete a nonexistent message!')});
        })
    }
    function cb(message){
        if(push){
            msgs.push(message);
        }

        if(typeof(callback) !== 'undefined'){
            callback(message);
        }
    }
}

exports.reset = function(){
	msgs = [];
}

exports.getMsg = function(cb){
	cb(msgs);
}