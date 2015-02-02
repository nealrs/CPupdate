### Uhm wut?

Hi there! My name is Neal Shyam and I'm the Community Manager at ChallengePost. This past weekend, I had the pleasure of attending [Hackcon II](http://hackcon.io) and met a _ton_ of great hackers & hackathon organizers.

I also got to talk to folks about what ChallengePost is doing well, what we're doing poorly, and how we could improve. One particular piece of feedback resonated with me a lot:  

>"It'd be great if I could update my projects on ChallengePost via an API or by pushing to GitHub."

Believe me, I get it. I update my [personal projects](http://challengepost.com/nealrs)  often and copying over the markdown from my readme feels silly. (Note: your readme really isn't the best description of your project &mdash; but I'll talk more about that in an upcoming blog post.)

Good products should deliver a ton of value and get the hell out of your way. Whether you're updating your PennApps hack a week later or releasing a new version of a personal project, you don't want to login & update info on _yet another_ site.

### On to solutions

Unfortunately, we don't have an API yet, I don't know Rails, and the CP dev team won't give me push access to our main repos. So much for an elegant solution. Womp womp.

But you know what? Fuck that noise. I'm a hacker and I remember life before jQuery. Why not use this as an opportunity to learn more about node.js?

The solution I came up with is actually pretty simple: I automated the entire login & edit flow using [zombie](https://github.com/assaf/zombie), a headless browser testing tool.

Right now, the only project data you can edit is the tagline & description and you need to login via the email flow, **but it works**. To update a project on ChallengePost, all you need to do is:

```bash
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

Next, we navigate, via headless browser, to the editing route of our software page (challengepost.com/software/foo/edit). This redirects us to a log in flow. Zombie uses the login/pass to authenticate us and returns us to the edit page.

Now that the edit form is enabled, we can update the tagline & description parameters and submit the form again. Once this operation returns, the script confirms via the console and also opens a new window so you can confirm the changes with your own eyes.


### Testing & stability

Throughout the flow, we need to ensure that we're on the right pages, that those pages are loading, and that form data is posts successfully. I used simple `assert` statements throughout the script that will error out if something doesn't check out.

I don't know much (read: _anything_) about TDD, but I'd appreciate your help making this more secure / adding some exception catching.

### Installation, development, and contribution

I haven't packaged this up for npm yet, because I don't how to do that -- but if you download `CPupdate.js` into your repo & run `npm install zombie open colors nomnom`, you should be ready to roll.

and is MIT licensing OK with you?
