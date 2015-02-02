## CPupdate.js

_An 'in-repo' CLI for updating your projects on ChallengePost._

### Uhm wut?

Hi there! My name is Neal Shyam and I'm the Community Manager at ChallengePost. This past weekend, I had the pleasure of attending [Hackcon II](http://hackcon.io) and met a _ton_ of great hackers & hackathon organizers.

I also got to talk to folks about what ChallengePost was doing well / poorly and how we could improve. One piece of feedback resonated with me a lot.  

>"It'd be great if I could update my projects on ChallengePost via an API or by pushing to GitHub."

Believe me, I get it. I update my [personal projects](http://challengepost.com/nealrs) pretty often and copying over markdown from my readme feels silly. (Note: your readme probably isn't the best description of your project &mdash; but I'll talk more about that in an upcoming blog post.)

Good products should give you a ton of value and get the hell out of your way. Whether you're updating your PennApps hack a week later or releasing a new version of a personal project, you don't want to login & update  info on _yet another_ site.

### On to solutions

Unfortunately, we don't have an API yet. I know that's a bummer and while it might deter some folks, I'm a fucking hacker and I remember life before jQuery.

So, in the spirit of my favorite [Facebook group](https://www.facebook.com/groups/hackathonhackers), I decided to use node.

The solution I came up with is pretty simple: a script that uses [zombie](https://github.com/assaf/zombie), a headless browser testing tool, to automate the process of logging in & editing a project on ChallengePost.

Right now, the only data you can edit is the project tagline & description and you need to login via the email flow, but it works. To update a project on CP, all you need to do is:

```
node CPupdate.js -l user@domain.com -p sUp3rs3cr3t -s myProject -t "my project does cool things!" -d readme.md
```

### How it actually works

Using [nomnom](https://github.com/harthur/nomnom), I created a simple command line interface for authentication parameters (`login` and `pass`) and project specific info (`slug`, `tagline`, and `readme`):

```
Usage: node CPupdate.js [options]

Options:
   -l, --login     Your email address
   -p, --pass      Your ChallengePost password
   -s, --slug      Project slug (e.g. foo in http://challengepost.com/software/foo)
   -t, --tagline   New project tagline (117 characters max)
   -r, --readme    Readme filename  [readme.md]
```

Although the `tagline` parameter is optional, you must specify a `readme` file or the script will default to readme.md & throw an error if it doesn't exist.

Next, we navigate, via headless browser, to the editing route of our software page (http://challengepost.com/software/foo/edit). This redirects us to a log in flow. Zombie uses the login/pass to authenticate us and returns us to the edit page.

Now that the edit form is enabled, we can update the tagline & description parameters and submit the form again. Once this operation returns, the script confirms via the console and also opens a new window so you can confirm the changes with your own eyes.


### Testing & stability

Throughout the flow, we need to ensure that we're on the right pages, that those pages are loading, and that form data is posts successfully. I used simple `assert` statements throughout the script that will error out if something doesn't check out.

I don't know much (read: _anything_) about TDD, but I'd appreciate your help making this more secure / adding some exception catching.

### Installation, development, and contribution

I haven't packaged this up for npm yet, because I don't how to do that -- but if you download `CPupdate.js` into your repo & run `npm install zombie open colors nomnom`, you should be ready to roll.

and is MIT licensing OK with you?
