Sodo is a CLI for managing non-code dependencies.

## Installing

```sh
npm install sodo --global
which sodo
```

Navigate to where sodo is installed.

```sh
npm install
```

## Usage and Getting Started

Sodo provides programmatic management and tracking of your non-code dependencies.  For instance, the following command will open your backlog resource:

```sh
sodo backlog show
```

Regardless of what provider you use for managing your backlog, sodo will open it to the where you have configured the backlog for your project.

Sodo commands follow the pattern: 

```sh
sodo <resource> <verb> <optional-label>
```
or
```sh
sodo <verb> <resource> <optional-label>
```


All resources share the following verbs:

```sh
sodo <resource> init
sodo <resource> list
```

* `init` will let you edit or add the configuration for your resources.

You can have multiple instances of each resource as long as you differentiate them with labels.  For instance, you could manage your public backlog and private backlog.

* `list` will show all of the configured instances and their labels.

## The Sodo Score
High performance engineering teams follow a common set of best practices and utilize certain classes of tools.  The Sodo Score is a way to quantify if your project is aligned with those best practices.  The Sodo Score is displayed as part of the project summary.

There is also sodo command specifically for the score:

```sh
sodo score -m 80
```
The exit code of the process indicates whether the score meets the minimum or not.

## Resources
### Project
The project resource indicates how to build and execute the project.
```sh
sodo project build
```
```sh
sodo project run
```
### Backlog
The backlog resource indicates where bugs/issues/stories are tracked.
```sh
sodo backlog show

sodo backlog show --id <issue_id>
```
```sh
sodo backlog add
```
### Forum
The forum resource indicates where developers go to discuss the project.
### Log
The log resource indicates where the application's log output is.

```sh
sodo log show
```
Opens the log.
```sh
sodo log tail
```
Tails the log.
### Test
```sh
sodo test show
```
```sh
sodo test run 
```
Runs the tests.

### Lint
```sh
sodo lint show
```
```sh
sodo lint run 
```
