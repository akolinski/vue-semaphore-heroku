# vue-semaphore-heroku

[![Build Status](https://semaphoreci.com/api/v1/akolinski/vue-semaphore-heroku/branches/master/badge.svg)](https://semaphoreci.com/akolinski/vue-semaphore-heroku)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
[![Greenkeeper badge](https://badges.greenkeeper.io/akolinski/vue-semaphore-heroku.svg)](https://greenkeeper.io/)

We use Semaphore as our CI tool with Heroku as our deployment server.
 
## Set up in terminal

```
git clone <name_of_project_github_url>
``` 

```
cd <name_of_project>
``` 

```
yarn install
```

##### Compile and hot-reload for development
```
yarn run serve
```

##### Compile and minify for production
```
yarn run build
```

##### Run your tests
```
yarn run test
```

##### Lints and fixes files
```
yarn run lint
```

##### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## How to create this project

### 1. Generate a Vue.js project

```
npm install npm@latest -g
brew update
brew install yarn
brew upgrade yarn
yarn global add @vue/cli
vue create name_of_project
yarn serve
``` 

When running the ```vue create``` command you will have to select you presets. I set my presets up with Babel router, CSS Pre-processors, Linter / Formatter and Unit testing. Select Sass/SCSS with node-sass. Select ESLint with error prevention only. Select Lint and fix on commit. Select Mocha + Chai.

```
cd <name_of_project>
yarn serve
``` 

Run a ```yarn build``` to prepare you app for production.

### 2. Create your heroku app

First of all you need to install Heroku.

```
brew install heroku/brew/heroku
```

When installed you can use the ```heroku``` command from your terminal.

```
heroku login
```

You need to have node, npm and git installed on your machine to proceed.

```
node --version
npm --version
git --version
```

We are creating a vue js project using yarn with Heroku. I used the <a target="_blank" href="https://devcenter.heroku.com/articles/getting-started-with-nodejs">Getting started on Heroku with Node.js</a> documentation as a guide.

```
heroku create <name_of_project>
heroku config:set NODE_ENV=production --app <name_of_project>
git push heroku master
```

There might be some prompts regarding the command below follow the instructions shown in terminal.

```npx @heroku/update-node-build-script```

Your app should show at the Heroku URL specified in terminal but it will not work just yet. As a handy shortcut, you can open the website as follows ```heroku open```. We need to keep our generated dist directory. We can always keep a pristine copy of what we have deployed to Heroku by commenting the dist/ folder from .gitignore.

```
# dist/ --- COMMENT THIS LINE OUT
```

We now need to create a ```server.js``` file to build our site. Since Vue is only a frontend library, the easiest way to host it and do things like serve up assets is to create a simple Express friendly script that Heroku can use to start a mini-web server. Read up quickly on <a href="https://expressjs.com/" target="_blank">Express</a> if you haven’t already. After that, add express:</p>

```
yarn add express --save
```

Now add a ```server.js``` file to your project’s root directory:

```
var express = require('express');
var serveStatic = require('serve-static');
var app = express();
app.use(serveStatic(__dirname + "/dist"));
var port = process.env.PORT || 5000;
app.listen(port);
// console.log('http://localhost:5000 server started.');
```

IMPORTANT: What you probably noticed is that this will serve up a dist directory. dist is a predefined directory that Vue.js builds which is a compressed, minified version of your site. We’ll build this and then tell Heroku to run server.js so Heroku hosts up this dist directory:

```
yarn run build
```

You should see an output dist directory now. Let’s test our server.js file by running it:

```
node server.js
```

Now go to <a href="http://localhost:5000" target="_blank">http://localhost:5000</a> and make sure your app loads. This is the actual site Heroku will serve up. Lastly, we’ll have to edit our start script in package.json to start our node server, as Heroku will automatically look for this script when looking for how to run a node.js app.

```
// package.json
{
  "name": "<YOUR-PROJECT-NAME-HERE>",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "",
  "private": true,
  "scripts": {
    "dev": "node build/dev-server.js",
    "build": "node build/build.js",
    "start": "node server.js",   <--- EDIT THIS LINE HERE 
...
```

Let's add, commit and deploy our changes to see if it works.

```
git add .
git commit -m "Adding files"
git push heroku master
heroku open
```

You should now see what you had locally in production.

### 3. Version control

We need to version control this in our own Github repository. Create a repository in Github with your <name_of_project>. Then we need to push all our code to that repository.

```
git init
git add .
git commit -m "First commit"
git remote add origin <name_of_project_github_url>
git push -f origin master

```

Your code should now be shown in the ```master``` branch on Github. Before we move on let's create another branch.

```
git branch stable
git checkout stable
git push origin stable
```

IMPORTANT: We will use the ```stable``` branch as a staging branch and the ```master``` branch will be used as the production branch. You should always branch out from the ```stable``` branch to build your features and then create a pull request to merge to the stable branch. Once the PR has been tested, reviewed and approved it can manually be merged to ```master```. It will then trigger an automatic deploy to production.

### 4. Semaphore CI

Semaphore is a hosted continuous integration and delivery service for private and open source projects. First of all you need to add a new project and select your repository from Github. Select the ```master``` branch and choose who will own the project. As we have built a Vue.js app with a ```package.json``` file select JavaScript as the language, a recent version of node.js and remove 'Job #1' and only have Setup with the ```npm install``` command present, press 'Build With These Settings'. The project will now build and it should pass. Once passed go to the dashboard for the project and press "Set Up Deployment". Select Heroku and then Automatic and select the ```master``` branch. You will have to login to Heroku and grab your API key from your account settings. Once pasted click "Next Step". Select your Heroku application, the one we just built above and give it a nice server name and paste the production URL that we have from Heroku. When you get to the next screen just click "Deploy". Once the deploy is complete you have finished setting up Semaphore. If you like go to Project settings and click on Badges on the left hand side. Copy the Markdown line and paste it to the top of your README.md file for added documentation sugar. You can also click on Notifications and select to receive notifications via email after deploys.

### 5. Heroku deploy settings

Go to the Heroku dashboard and click on your app. Then select the Deploy tab and go to "Deployment method" and select "Github". Search for the repository name that is linked to the Heroku app and connect it. Under "Automatic deploys" have the ```master``` branch automatically deploy and check the "Wait for CI to pass before deploy" box. Press "Enable Automatic Deploys".

### 6. Heroku pipelines

Go to the Heroku dashboard and click on your app.  Then select the Deploy tab and go to "Add this app to a pipeline" and choose to "Create new pipeline". Name the pipeline, select "production" as the stage and press "Create pipeline". Connect the pipeline to the Github repository in the pipelines settings. Now click on Pipeline and press "Enable Review Apps". Follow the prompts to create the app.json file and commit it to the repository. Check the "Create new review apps for new pull requests automatically" checkbox and "Destroy stale review apps" checkbox. Your pipeline is now set up but we need to make sure our stable branch is ready with our recently committed app.json file.

```
git checkout master
git pull origin master
git checkout stable
git pull origin stable
git merge master
git push origin stable
```

Make a change, run ```yarn build``` locally and then create a pull request from stable to master and watch the magic happen. First it will create a review app and once merged into master it will automatically deploy to production.

#### Github marketplace

There are additional tools that we integrate into our workflow that will help with streamlining the review process.

- <a href="https://github.com/marketplace/accesslint" target="_blank">AccessLint</a>
- <a href="https://github.com/marketplace/wip" target="_blank">WIP</a>
- <a href="https://github.com/marketplace/codefactor" target="_blank">CodeFactor</a>
- <a href="https://github.com/marketplace/greenkeeper" target="_blank">Greenkeeper</a>

#### Troubleshooting

```*Your account has reached its concurrent builds limit```

You need to add a credit card to your heroku account settings in order for your account to be verified or you will receive build failures in Semaphore. The app will still deploy but in order to fix this bug this is what you need to do. As long as you are not using any additional services you will not be charged.

<a href="https://devcenter.heroku.com/articles/account-verification" target="_blank">https://devcenter.heroku.com/articles/account-verification</a>
