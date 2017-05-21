THIS FILE IS A BRAIN DUMP OF SHIT.

IGNORE IT. OR TRY AND CONSUME IT.

BUT DON'T EXPECT ANYTHING STRUCTURED AT THIS POINT.


# API

brew install sodo
...

sodo init

sodo validate

sodo list

sodo score

  This is the big one. So here we will calculate a score if there are integrations in place that is a higher score.
  If it's all manual steps (which is OK) then there is a smaller score. If there is absence of items, no score.

sodo ci

  Are there any continuous integration systems defined in the configuration, if there are
  what platform are they using and have they been verified and authenticated.

  If they have users are asked to create and account or their account is automatically added.

sodo cd

  Are there any continuos deployment tools set up that push code through to integration.

sodo containers

sodo swagger

  Is the API defined anywhere in docs such as swagger.

sodo database

  Does the application have a database layer

sodo caching

  Does the application use caching, if so which and what is the configuration

sodo describe

  Provides the full read out of what the application is going to need to require.

sodo envs

  Provides a full list of environments (beta, integ, prod, etc).

sodo releases

  Provides a list of releases across applications.

sodo prod

sodo integ

sodo backlog

sodo tickets

sodo arch

sodo oncall

sodo logs

sodo dashboard

sodo health

sodo change

sodo walkthrough

sodo developers

  sodo developers add -git duffymeister
  sodo developers add -email duffy@f9teams.com

sodo announce

sodo infrastructure

  output:

    There are currently three infrastructure configurations on AWS. Two are active and one is production.

      (1) ...
      (2) ...
      (3) ...

sodo tests

sodo source

sodo build

sodo events

sodo issues

sodo cliffnotes

sodo readme

---

easter eggs.

sodo does-mark-have-a-chair

---

Enterprise functions

sodo approvals

---

# Onboarding functions

sodo


# File structure for sodo command.

  (a) All commands are a javascript file with the children loaded in dynamically.
  (b) All commands are base type command and that object has some simple interfaces.
  (c) All commands have a basic type with is text and reports a score.
  (d) All commands query or mutate a particular portion of the config.

  (e) The config contains activities and resources
  (f) Activities are in a separate directory

  Named activities are like build steps (npm test) ...
  Activity: onboard, { steps }
  Activity: remove, { steps }

  (i)   Activities are commands on the resource object, by default add user, remove user etc. but custom commands are supported.
  (ii)

  JIRA = new Resource();

  JIRA.actions {


  }

  JIRA.activities {

  }

  Why are activities and actions different?

  add is a default action for example.

    jira.add(endpoint, board, ...)

    jira.addUser(endpoint, board, ...)

    jira.addTicket(endpoint, board, ...)

    jira.createBoard(endpoint, boardname)

    jira.getTickets(endpoint, boardname)

    jira.map(...)

  Resources: Backlog, JIRA, Etc.
  Resources: Source, github.
  Resources: Oncall, pagerduty.
  Resources: Docs, confluence,
  Resources: Docs, google
  Resources: Docs, etc.
  Resources: ci, CircleCI
  Resources: guide, steps.

  "activities": {
    "onboard": {
      "form":{
        "id": "onboardform",
        // Smarts on the server here to know what form type that is.
      },
      "checklist":{
        ...
      }
      "email":{
        "addUser": {}

      }
    }
    "offboard":
  }
  "resources":{
    "backlog": {
      "type": "jira",
      "settings": {
        "endpoint": "http://foo"
        "board": "zimbra"
      }
    },
    "tests": {
      "type": "manual",
      "description":"blah blah blah"
    }
  }

  JIRA = new Resource();
  JIRA.key = "jira";
  JIRA.types = ["backlog", "tickets", "etc"];
  JIRA.add = function(){} // Overrides the base class
  JIRA.nnn = function(){} // Named functions that can be called on the resource (sodo backlog list)

  sodo.backlog.open();

  sodo backlog add

  $ sodo backlog add jira [opts]
  Jira added as the backlog, we've not connected that yet, visit shipday.one to connect to your jira instance.

  $ sodo ci add circleci [opts]
  CircleCI added as the CI provider, we've not connected that yet.

  $ sodo docs add google-docs [opts]
  Google Docs added as the documentation provider, we've not added that yet.

  $ sodo score
  Your sodo score  is 10/100 you can help get developers shipping on day on by:
    [x] Connect CircleCI, JIRA and Google documents
    [x] Add an architecture diagram
    [x] Add an oncall rotation
    [x] ...

  [switch to UI and authenticate]

  $ sodo onboard

  New developers on this project need to complete the following:

    1. Request access to CircleCI and follow the getting started guide here.
    2. Request access to JIRA
    3. Request access to the following google doc.
    4. Download and install node
    5. Download and install kubernetes

    SODO Tip: Add integrations to speed up onboarding.

  // Once

  $ sodo onboard duffy@f9teams.com

  We've sent a simple email to duffy@f9teams.com but we could do so much more if
  you connected you apps at shipday.one.

  - OR -

  New developer added to the project. We are getting them cooking in no time at
  all. With a sodo score of 90/100 I'd bet a pizza they ship on day one.

  $ sodo checklist

  Give the user a checklist of what steps remain to get on-boarded

    [√] Add CircleCI to your environment
    [√] Add Artifactory

  etc.



  var Resource = require('./resource').Resource;

  Trello = new Resource();
  Trello.key = "trello";
  Trello.types = ["backlog", "tickets"]

  Trello.add ();
  Trello.summary();
  Trello.help();

  GitHub.add();
  GitHub.summary();
  GitHub.help = function(){};


  sodo onboard

  Welcome to MyAwesomeApp, let's get you started.

  GitHub username (duffmeister)
  Google account (robduffy@gmail.com)
  Trello account (robduffy@gmail.com)
  CircleCI ()
  NewRelic (duffy@f9teams.com)
  AWS ()
  Dockerhub ()

  // Onboarding can be done via the command line for now.

  // Approvals -- other member
  // Approvals -- manager
  // Approvals -- named

  GitHub.onboard = function(){
    // Pre-requisites
      // Github user name
    //

  }

  GitHub.offboard = function(){

  }

  sodo onboard robduffy@gmail.com

  Email sent to that user with instructions on how to install sodo and start
  setting up repository for development.







  sodo add source github help
  sodo add tickets github
  sodo add ci circleci

  sodo ci




  var init = new Resource({
    score: {},
    commands: ["run"]
  });

  init.summary = function(){

  }

  init.run = function(){
    // Check for a config file.
    // Look for everything else
    //
  }

  var backlog = new Type({
    score: {
        none: 0,
        manual: 1,
        connected: 2
    },
    commands: ["add", "remove", "usage", "list", "summary"]
  });

  var file = new Resource({

  });

  sodo backlog add file ./backlog.md

  var score = new Type({

  })


  var score = new Command({

  });

  var init = new Command({

  });

  var tips = new Command({

  });

  var login = new Command({

  });



  // How is this different from file?
  var link = new Resource({

  })

  // Remember to add to onboard/offboard when you add or remove the setting.

  // Question can anything mutate the onboard/offboard list directly.

  //


  /*

    Let's look at backlog adding trello or jira.


    sodo backlog add trello https://trello.com/b/dGYFPPyE

    sodo ci add circleci

    sodo tests add mocha

    sodo env add aws

    sodo repo add artifactory

    sodo docs add readme

    sodo docs add google

    sodo config add puppet

    sodo tickets add

    sodo dashboard add datadog

    sodo oncall add pagerduty

    sodo logs add file

    sodo readme add file









  GoogleDocs = new Resource();
  GoogleDocs.key = "google-docs";
  GoogleDocs.types = ["arcitecture", "requirements", "opsguide", "sop"];





  {
    "account_id": "xxx",
    "access_key": "xxx-should-be-env-xxx",
    "type": "developer",
    "event": "xxx",
    "approvals": [{
        "type": "manager"
      }],
    "introductions": [
      "@duffy", "@schoonover", "@carla"
    ]
    "sodo-checklist": [
      // List of items (working-backwards)
    ],
    "activities": [
      {
        "type": projectmanagement,
        "name": "Add the user to JIRA",
        "strain": "jira",
        "config": {
          "board": "sodo",
        },
        "activities": [{
          "type": "tasklist",
          "type": "event",
          "type": "notification"
        }]
        "type": task,
        "strain"
        type: "repository"
        strain: "github"

        type: "timetracking"

        type: "cd",
        type: "ci",

        type: "documents",
        type: "etc",

        type: "input"

        type: "approval"

        type: "tests"
        strain: "link"

        type: "infrastructure"
        strain: "docker"

        integration environment
        production environment
        dashboards and links

        sodo: {
          env
        }

      }
    ]
