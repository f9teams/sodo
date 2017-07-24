const inquirer = require('inquirer');
const { isEmpty, get, extend } = require('lodash');
const opn = require('opn');
const log = require('../log');
const Trello = require('node-trello');
const { Backlog } = require('../resource');

class TrelloBacklog extends Backlog {
  configure(opts) {
    if (opts.boardUrl) {
      const reg = /b\/([^/]+)/ig;
      const boardUrl = opts.boardUrl;
      opts.boardId = reg.exec(boardUrl)[1]; // eslint-disable-line no-param-reassign
      delete opts.boardUrl; // eslint-disable-line no-param-reassign
    }

    return super.configure(opts);
  }

  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'boardUrl',
        message: 'Trello board URL',
        default: get(this.spec, 'config.boardUrl'),
        when: () => isEmpty(opts.boardUrl),
      }, {
        type: 'apiKey',
        name: 'apiKey',
        message: 'Trello api key',
        default: get(this.spec, 'config.private.apiKey'),
      }, {
        type: 'appKey',
        name: 'appKey',
        message: 'Trello app key',
        default: get(this.spec, 'config.private.appKey'),
      },
    ];

    return super.init(opts)
      .then(specConfig => inquirer.prompt(questions)
        .then(({ boardUrl, apiKey, appKey }) => extend(specConfig, { boardUrl, private: { apiKey, appKey } }))); // eslint-disable-line max-len
  }

  add() {
    // Trello has provides no way to create
    const path = this.spec.config.boardUrl;
    log.info({ path }, 'opening Trello to create card');
    return opn(path, { wait: false });
  }

  show(opts) {
    const t = new Trello(this.spec.config.appKey, this.spec.config.apiKey);

    let cardId;
    if (opts.id) {
      cardId = opts.id;
    } else {
      // what do we do if no id? - return board url
      const path = this.spec.config.boardUrl;
      log.info({ path }, 'opening Trello to create card');
      return opn(path, { wait: false });
    }
    return t.get(`/1/boards/${this.spec.config.boardId}/cards`, (err, body) => {
      if (body && body.length > 0) {
        let shortLink;

        // Loop1 short-id search
        body.forEach((card) => {
          if (card.idShort == cardId) { // eslint-disable-line eqeqeq
            shortLink = card.shortLink;
          }
        });

        // Loop2 shortLink - validation that this short link exsists
        body.forEach((card) => {
          if (card.shortLink === cardId) {
            shortLink = card.shortLink;
          }
        });

        if (shortLink) {
          log.info({ path: `https://trello.com/c/${shortLink}` }, `opening Trello to ${shortLink}`);
          return opn(`https://trello.com/c/${shortLink}`, { wait: false });
        }
        log.info('can\'t find shortlink on board');
        return new Error(`Uhoh, we couldn't find card '${cardId}'`);
      }

      log.info(`can't find shortlink on board. body: ${body}`);
      return new Error(`Uhoh, we had trouble retreiving card '${cardId}'`);
    });
  }
}

module.exports = TrelloBacklog;
