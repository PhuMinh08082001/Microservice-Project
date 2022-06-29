var TaskScheduler = function () {
  var commands = [];

  return {
    execute: async function (command) {
      let result = await command.execute(command.argument);
      commands.push(command);
      return result;
    },
    rollback: async function () {
      var command = commands.pop();
      let result = await command.rollback(command.argument);
      return result;
    },
    getCommands: function () {
      return commands;
    },
  };
};

module.exports = TaskScheduler;
