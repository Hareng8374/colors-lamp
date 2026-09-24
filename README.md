# colors-lamp

This is the COLORS app from the LAMP stack lab in COP 4331 at UCF. It's a small web app where you log in and keep a list of colors. You can search your colors or add new ones, and everything is saved in a MySQL database.

The point of the lab was to get a full LAMP stack (Linux, Apache, MySQL, PHP) running on a real server and see how the front end, the API, and the database talk to each other. I set mine up on a DigitalOcean droplet and it's running at http://167.99.3.98.

## Description

How the app works:

1. index.html is the login page. When you click "Do It", code.js sends the username and password to Login.php, which checks them against the Users table.
2. If the login is right, your name and user ID get saved in a cookie (it lasts 20 minutes) and you go to color.html. If it's wrong you get "User/Password combination incorrect".
3. On color.html you can search your colors by typing part of a name, or add a new color. Colors are saved with your user ID, so a search only returns your own colors.
4. Log Out clears the cookie and takes you back to the login page. If you open color.html without being logged in, it sends you back to the login page too.

There's no sign up page, so users have to be added straight into the database.

The API is just three PHP files. The front end sends each one a POST request with a JSON body and gets JSON back:

- Login.php takes `login` and `password` and returns `id`, `firstName`, `lastName`, and `error`. If the login doesn't match anything, `id` comes back as 0.
- AddColor.php takes `color` and `userId` and returns `{"error":""}`.
- SearchColors.php takes `search` and `userId` and returns a `results` array of color names. If nothing matches, you get `"error":"No Records Found"` and no `results`.

The database is called COP4331 and has three tables: Users, Colors, and Contacts. Contacts isn't used by this app at all. We made it in lab as a starting point for the team project later in the semester.

## Tech stack

- Ubuntu 24.04 on a DigitalOcean droplet (the LAMP 1-Click image)
- Apache
- MySQL 8.0 (8.0.46 on my server)
- PHP with mysqli
- Plain HTML, CSS, and JavaScript on the front end, no frameworks
- md5.js (JavaScript-MD5 by Sebastian Tschan, MIT license), which came with the lab files

## Repo structure

```
api/          the 3 PHP endpoints, plus config.sample.php
database/     schema.sql (creates the database, tables, sample data, and DB user)
public/       index.html, color.html, css/, js/, images/
.gitignore
LICENSE.md
README.md
```

The real database password goes in api/config.php, which is in .gitignore so it never gets committed. Copy config.sample.php to make it.

images/background.png came with the lab files, but nothing in the pages or CSS uses it right now.

## Setup

You need a server with Apache, MySQL, and PHP. I used the DigitalOcean LAMP 1-Click droplet (Ubuntu 24.04), which comes with all three already installed.

1. SSH into the server and clone this repo:
   ```
   git clone https://github.com/Hareng8374/colors-lamp.git
   cd colors-lamp
   ```
2. Open database/schema.sql and change `CHANGE_ME` near the bottom to the password you want the API's database user to have. Don't commit that change.
3. Run the script to create the database, tables, sample data, and user:
   ```
   mysql -u root -p < database/schema.sql
   ```
   On the DigitalOcean LAMP droplet, the MySQL root password is saved in /root/.digitalocean_password. On a plain Ubuntu install, root usually logs in through sudo instead, so run `sudo mysql < database/schema.sql`.
4. Make the config file and put the same password in `DB_PASS`:
   ```
   cp api/config.sample.php api/config.php
   nano api/config.php
   ```
5. Open public/js/code.js. The first line is:
   ```js
   const urlBase = 'http://167.99.3.98/LAMPAPI';
   ```
   That's my server's IP. Change it to your server's IP or domain and keep the `/LAMPAPI` part.

## Deployment

The folders in this repo don't match the way the files are laid out on the server. I split things into api/ and public/ for the repo, but on the server everything lives in Apache's web root (/var/www/html), and the PHP files go in a folder called LAMPAPI:

```
public/index.html   ->  /var/www/html/index.html
public/color.html   ->  /var/www/html/color.html
public/css/         ->  /var/www/html/css/
public/js/          ->  /var/www/html/js/
public/images/      ->  /var/www/html/images/
api/*.php           ->  /var/www/html/LAMPAPI/   (config.php yes, config.sample.php no)
```

schema.sql doesn't get copied anywhere. You just run it once (step 3 above).

To copy everything over, run this from the repo folder on the server:

```
sudo mkdir -p /var/www/html/LAMPAPI
sudo cp -r public/* /var/www/html/
sudo cp api/AddColor.php api/Login.php api/SearchColors.php api/config.php /var/www/html/LAMPAPI/
```

This replaces the default index.html that comes with the droplet. Also, Linux file names are case sensitive, so LAMPAPI and the PHP file names have to match exactly or the requests from code.js will fail.

## How to use it

There's nothing to build. Once the files are in place, go to http://167.99.3.98 (or your own server's address) in a browser.

On the live site, log in with the AYadavally account I set up on my server. I left its password out of this README since the repo is public. That account already has a list of colors, so you can search right away (try "blue", or leave the search box empty to see all of them) and add new ones.

If you set up your own server with schema.sql, the sample accounts are RickL with password COP4331 (already has a bunch of colors) and SamH with password Test. schema.sql has the sample data from the lab handout.

You can also call the API directly with curl or Postman. For example, on a server set up with schema.sql:

```
curl -X POST http://<your-server>/LAMPAPI/Login.php -H "Content-Type: application/json" -d '{"login":"RickL","password":"COP4331"}'
```

## Assumptions

- The server is a DigitalOcean LAMP droplet or something close to it (Ubuntu, Apache, MySQL 8, PHP).
- Apache's web root is /var/www/html.
- MySQL is on the same machine, so the API connects to localhost.
- The front end and the API are on the same server.
- Users get added directly in MySQL since there's no sign up page.

## Limitations

This is the lab code mostly as we built it, so there are some problems I left alone:

- Passwords are stored in plain text. code.js has an md5 hashing line, but it's commented out, and that's how the course code had it. Rows 3 and 4 of the sample Users data are the md5 hashed versions, for if hashing ever gets turned on.
- It runs on plain HTTP, not HTTPS, so passwords are sent unencrypted.
- The API trusts whatever userId the browser sends. There's no session on the server, so someone could send a different userId and see or add another user's colors.
- urlBase in code.js is hardcoded to my server's IP, so it has to be changed for any other server.
- If a search finds nothing, the API sends back an error with no `results` array and code.js doesn't handle that. The list just doesn't update and there's a JavaScript error in the console.
- The PHP builds its JSON responses by gluing strings together instead of using json_encode, so a color name with a `"` in it breaks the response.
- You can't sign up, and you can't edit or delete colors.
- The database user from the lab handout has all privileges on COP4331 and can connect from any host.

## AI assistance

I built and deployed the app itself during the lab sessions. The PHP endpoints, HTML pages, CSS, and front end JavaScript are the lab code. I used an AI tool for some of the work of turning that into this repo:

- **Tool**: Claude Code (Anthropic's AI coding tool), using the Claude Opus 5.5 model
- **Date**: September 24, 2026
- **Scope**: Reorganizing the lab files into the api/, public/, and database/ folders and splitting them into commits, moving the database password out of the PHP files into config.php, putting together schema.sql from the lab handout, drafting this README, and checking the repo against the assignment requirements before submitting.
- **Use**: Code generation and refactoring for the credentials change. It wrote config.sample.php, added a `require_once` of config.php to each of the three PHP files, and changed their `new mysqli(...)` lines to use the `DB_` constants. Those are the only lines it changed in the endpoints. Writing help for the first draft of this README and the comments in schema.sql. Review of the finished repo for leftover passwords, junk files, and missing README sections, and testing the live site with curl after I deployed.

I deployed the updated PHP files to my server myself and ran php -l on them. config.sample.php has a comment at the top marking it as AI-assisted.

## License

MIT, see LICENSE.md. md5.js keeps its own MIT license from its author, which is at the top of that file.
