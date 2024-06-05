# Allstar Voter

Simple js program to fill out an MLB allstar ballot automatically using selenium.

This does not bypass captcha and requires some manual intervention to do captcha.
User also needs to create a `.personalInfo.json` file and update the path in vote.js
to point to the created file. Lastly, the user needs to update the list in vote.js with
the players they want to vote for.

# todo 

give example json

## Usage

- [install node](https://nodejs.org)
- install chromedriver
    ```
    npm install chromedriver
    ```
- create and populate `.personalInfo.json`
ex
```
{
  "email": "email@example.com",
  "zipcode": "99999",
  "bdayMonth": "January",
  "bdayDay": "1",
  "bdayYear": "1960",
  "country": "USA",
  "favTeam": "Mariners"
}
```
- run `node vote.js` and then complete the captcha.

