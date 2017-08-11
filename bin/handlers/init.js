/* eslint-disable no-console */

const inquirer = require('inquirer');
const sodo = require('../../lib/sodo');
const log = require('../../lib/log');
const config = require('../../lib/config');
const registry = require('../../lib/resource-registry');
const { isEmpty, sortBy } = require('lodash');
const analytics = require('../../lib/analytics');

function whichResourcePrompt(resourceType) {
  log.debug({ resourceType }, 'which resource');

  const resourceLabels = config.resources[resourceType].map(b => b.label);

  const questions = [
    {
      type: 'list',
      name: 'label',
      message: `Choose a ${resourceType} to initialize`,
      choices: resourceLabels.concat(['new']),
      default: 'new',
      when: () => !isEmpty(resourceLabels),
    },
  ];

  return inquirer.prompt(questions).then(answers => answers.label || 'new');
}

function resourceChoices(resourceType) {
  const choices = Object.entries(
    registry.resources[resourceType],
  ).map(([key, type]) => ({
    name: type.label,
    value: key,
  }));
  return choices;
}

function newResourcePrompt(resourceType) {
  log.debug(`init new ${resourceType}`);
  const resources = resourceChoices(resourceType);

  const newBacklogQuestions = [
    {
      type: 'input',
      name: 'label',
      message: `Enter a ${resourceType} label`,
      validate: v => {
        if (isEmpty(v)) {
          return `${resourceType} label cannot be empty`;
        }

        if (config.resources[resourceType][v]) {
          return `${resourceType} with label ${v} already exists, enter a unique label`;
        }

        return true;
      },
    },
    {
      type: 'list',
      name: 'id',
      message: `Choose a ${resourceType} type`,
      choices: resources,
    },
  ];

  return inquirer.prompt(newBacklogQuestions).then(answers => {
    const label = answers.label;
    const id = answers.id;
    const ResourceClass = registry.resources[resourceType][id].class;
    const resource = new ResourceClass({ label, id });
    config.resources[resourceType].push(resource.spec);
    return resource;
  });
}

function existingResourcePrompt(resourceType, label) {
  const spec = config.resources[resourceType][label];
  log.debug(
    { label, resourceType, spec },
    `init existing ${resourceType}: ${label}`,
  );

  const questions = [
    {
      type: 'input',
      name: 'label',
      message: `Enter a ${resourceType} label`,
      default: label,
      validate: v => {
        if (v === spec.label) {
          // label unchanged
          return true;
        }

        if (isEmpty(v)) {
          return `${resourceType} label cannot be empty`;
        }

        if (config.resources.backlog[v]) {
          return `${resourceType} with label ${v} already exists, enter a unique label`;
        }

        return true;
      },
    },
  ];

  return inquirer.prompt(questions).then(answers => {
    spec.label = answers.label;

    const resource = sodo.resources[resourceType][spec.label];
    return resource;
  });
}

function getResourcePrompt(resourceType, label) {
  if (label === 'new') {
    return newResourcePrompt(resourceType);
  }

  return existingResourcePrompt(resourceType, label);
}

function trackInit(argv, resource) {
  analytics.track({
    event: 'Init',
    properties: {
      command: sortBy(argv._),
      rawCommand: argv._,
      spec: resource.spec,
    },
  });
  return resource;
}

function initResourcePrompt(argv, resource) {
  return resource
    .init(argv)
    .then(resource.configure.bind(resource))
    .then(trackInit.bind(null, argv))
    .then(config.save.bind(config));
}

function initHandler(type) {
  return argv => {
    log.debug(argv, `${type} init`);

    const label = argv.label;

    analytics.track({
      event: 'Start Init',
      properties: {
        command: sortBy(argv._),
        rawCommand: argv._,
        label,
      },
    });

    if (label) {
      return getResourcePrompt(type, label).then(
        initResourcePrompt.bind(null, argv),
      );
    }

    // if we are missing a label we will ask the user for it
    return whichResourcePrompt(type)
      .then(getResourcePrompt.bind(null, type))
      .then(initResourcePrompt.bind(null, argv));
  };
}

module.exports = initHandler;
