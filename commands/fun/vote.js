const Discord = require('discord.js');

module.exports = {
    name: 'vote',
    description: 'Start a vote in chat',
    run: async (client, message, args) => {
        const voteUsers = new Array();
        let yesVotes = 0;
        let noVotes = 0;

        const voteTimer = args[0];
        args.splice(0, 1);

        const Embed = new Discord.MessageEmbed()
            .setTitle('Vote Started!')
            .setDescription('**' + args.join(' ') + '** \n' + 'React with :thumbsup: for yes or :thumbsdown: for no!')
            .setFooter('Vote started by: ' + message.author.username, message.author.avatarURL())
            .setColor('RANDOM');

        let msg = await message.channel.send(Embed);
        message.delete({ timeout: 250 });
        await msg.react('👍');
        await msg.react('👎');

        voteUsers.push(741492504683216936);

        client.on('messageReactionAdd', async (reaction, user) => {
            if(msg != null) {
                if (reaction.partial) {
                    try {
                        await reaction.fetch();
                    } catch (error) {
                        console.log('Something went wrong when fetching the message: ', error);
                        return;
                    }
                }

                const voteMsg = reaction.message, emoji = reaction.emoji;

                if(voteMsg.id == msg.id && voteUsers.indexOf(message.guild.member(user).id) == -1) {
                    try {
                        if (emoji.name == '👍') {
                            yesVotes += 1;
                        } else if (emoji.name == '👎') {
                            noVotes += 1;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else if(voteUsers.indexOf(message.guild.member(user).id) != -1 && message.guild.member(user).id != 741492504683216936) {
                    try {
                        if (emoji.name == '👍') {
                            yesVotes += 1;
                        } else if (emoji.name == '👎') {
                            noVotes += 1;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    reaction.users.remove(user);
                }

                console.log(yesVotes);
                console.log(noVotes);
                voteUsers.push(message.guild.member(user).id);
            }
        });

        client.on('messageReactionRemove', async (reaction, user) => {
            if(msg != null) {
                if (reaction.partial) {
                    try {
                        await reaction.fetch();
                    } catch (error) {
                        console.log('Something went wrong when fetching the message: ', error);
                        return;
                    }
                }

                const voteMsg = reaction.message, emoji = reaction.emoji;

                if(voteMsg.id == msg.id && voteUsers.indexOf(message.guild.member(user).id) != -1) {
                    try {
                        if (emoji.name == '👍') {
                            yesVotes -= 1;
                        } else if (emoji.name == '👎') {
                            noVotes -= 1;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                console.log(yesVotes);
                console.log(noVotes);
                voteUsers.splice(voteUsers.indexOf(message.guild.member(user).id), 1);
            }
        });

        setTimeout(function() {
            msg.delete({ timeout: 100 });
            msg = null;

            Embed.setTitle('Vote Ended!');
            Embed.setDescription('**' + args.join(' ') + '** \n' + 'The results are: :thumbsup:: ' + yesVotes + ' :thumbsdown::' + noVotes);

            message.channel.send(Embed);
          }, voteTimer * 1000);
    },
};