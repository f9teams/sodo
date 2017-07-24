/* eslint-disable */
// TODO fix this whole mess

const config = require('../../lib/config');
const chalk = require('chalk');
const { isEmpty } = require('lodash');

chalk.enabled = true;

module.exports = {
  command: 'readme',
  aliases: ['*'],
  handler: () => {
    let sodoScore = 0;
    let tips = [];

    console.log(`README.md for ${config.projectDir}`);
    console.log();

    const defaultProject = config.resources.project[0];
    if (defaultProject) {
      const projectDescription = defaultProject.config.description;
      console.log(projectDescription);
    }

    const tests = config.resources.test;
    console.log(chalk`Tests (usage: {bold sodo test <init|list|show|run> [label]})`);
    console.log();
    if (isEmpty(tests)) {
      console.log(chalk.red('  No tests has been configured for this project'));
      console.log(chalk.red('  Run \'sodo test init\' to configure tests'));
      console.log();
      tips.push('Consider adding tests with \'sodo test init\'');
    } else {
      sodoScore ++;
    }
    tests.forEach((test) => {
      const label = test.label;
      const description = test.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    const linters = config.resources.lint;
    console.log(chalk`Linters (usage: {bold sodo lint <init|list|show|run> [label]})`);
    console.log();
    if (isEmpty(linters)) {
      console.log(chalk.red('  No linters has been configured for this project'));
      console.log(chalk.red('  Run \'sodo lint init\' to configure a linter'));
      console.log();
      tips.push('Consider adding a linter with \'sodo lint init\'');
    } else {
      sodoScore ++;
    }
    linters.forEach((lint) => {
      const label = lint.label;
      const description = lint.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    const builds = config.resources.build;
    console.log(chalk`Builds (usage: {bold sodo build <init|list|show> [label]})`);
    console.log();
    if (isEmpty(builds)) {
      console.log(chalk.red('  No build has been configured for this project'));
      console.log(chalk.red('  Run \'sodo build init\' to configure a build'));
      console.log();
      tips.push('Consider adding a build with \'sodo build init\'');
    } else {
      sodoScore ++;
    }
    builds.forEach((build) => {
      const label = build.label;
      const description = build.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    const logs = config.resources.log;
    console.log(chalk`Logs (usage: {bold sodo log <init|list|show> [label]})`);
    console.log();
    if (isEmpty(logs)) {
      console.log(chalk.red('  No log has been configured for this project'));
      console.log(chalk.red('  Run \'sodo log init\' to configure logs'));
      console.log();
      tips.push('Consider adding logs with \'sodo log init\'');
    } else {
      sodoScore ++;
    }
    logs.forEach((log) => {
      const label = log.label;
      const description = log.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    const forums = config.resources.forum;
    console.log(chalk`Forums (usage: {bold sodo forum <init|list|show> [label]})`);
    console.log();
    if (isEmpty(forums)) {
      console.log(chalk.red('  No forum has been configured for this project'));
      console.log(chalk.red('  Run \'sodo forum init\' to configure a forum'));
      console.log();
      tips.push('Consider adding a discussion form with \'sodo forum init\'');
    } else {
      sodoScore ++;
    }
    forums.forEach((forum) => {
      const label = forum.label;
      const description = forum.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    const backlogs = config.resources.backlog;
    console.log(chalk`Backlogs (usage: {bold sodo backlog <init|list|show> [label]})`);
    console.log();
    if (isEmpty(backlogs)) {
      console.log(chalk.red('  No backlog has been configured for this project'));
      console.log(chalk.red('  Run \'sodo backlog init\' to configure tests'));
      console.log();
      tips.push('Consider adding backlog with \'sodo backlog init\'');
    } else {
      sodoScore ++;
    }
    backlogs.forEach((backlog) => {
      const label = backlog.label;
      const description = backlog.config.description;
      console.log(chalk`  label: {underline ${label}}`);
      console.log(description.replace(/^/gm, '  '));
    });

    console.log(chalk`{bold Your 🚀 sodo⌝ score is ${Math.floor(sodoScore / 6 * 100)}/100}`);
    if (!isEmpty(tips)) {
      console.log(chalk`{green.bold Duffy's Tip of the Day: ${tips[Math.floor(Math.random() * tips.length)]}}`);
    }
  },
};
