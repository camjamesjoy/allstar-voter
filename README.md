# Allstar Voter

Simple js program to fill out an MLB allstar ballot automatically using selenium.

This does not bypass captcha and requires some manual intervention to do captcha.
User also needs to create a `.personalInfo.json` file and update the path in vote.js
to point to the created file. Lastly, the user needs to update the list in vote.js with
the players they want to vote for.

## Usage

run `node vote.js` and then complete the captcha.
