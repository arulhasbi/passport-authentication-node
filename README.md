# passport-authentication-node

Hi folks, its been a while since I finished the mini-reddit project and for about two weeks I taught myself server programming using node.js. In this project, I'd like to applied what I have learned which to create an authentication flow using a simple combo of username-password with help of passport.js library.

Here are some new things that I have learned so far:
 
* event-loop nature which allows [node.js]() to perform non-blocking I/O operations even though javascript is a single-threaded language.
* [express.js]() as routing and middleware framework.
* [morgan]() as request(s) logger.
* [body-parser]() as body parser.
* [cors]() to enable cors.
* cookies and sessions.
* [express-session]() to manage sessions.
* [passport.js]() to handle authentication and authorization.
* [bcrypt]() to hash user's password before inserting into database.
* security-related HTTP Headers and how they can play an important role by preventing common web attacks such as clickjacking & cross-site scripting (XSS).

[UPDATE] --- Hello I'm back. So, I think I have hit my objective in this project which is to demonstrate the authentication flow that includes: register, login, and logout request handlers. For the authentication method, I utilize passport.js, a cool authentication middleware library for nodeJS. I am using local development for this experimentation and try to keep it very minimal so I could keep my focus and better understanding the basic concept of authentication. For basic concept of authentication reason as well, therefore I used the local authentication strategy and there are 500+ authentication strategies provided by passport.js. Let's get right into it.

I'd like to start by sharing two problems that I encountered along the way. 

- I tried the authentication from the server `localhost:4001` using template engine ejs, and it works. Then, I want to know if I seperated the client, it's gonna work or not. Therefore, I created the client with react `localhost:3000`. When I try to make a post request, my body didn't seem goes through to the server because when I logged the value, it tells `undefined`. Turned out, I had to use the header `Content-Type: application/json` 😭. Sorry, I am noob.

- Then, another fiasco was that the client browser did not keep the cookie from server response and once I got the cookie, I make a request, my server does not catch the cookie from browser, instead creating a new session. After searching out for the solution, turns out I had to specify the value for credentials property both in client request and cors middleware in the server. For additions, I did not specify `sameSite` and `secure` in the cookie since I am not working with `https` yet. Only `maxAge` for session expiration and `httpOnly` for securing cookies from javascript access.

Client request
```
const base = "http://localhost:4001";
const response = await fetch(`${base}/login`, {
  method: "POST",
  mode: "cors",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
return response;
```

Cors middleware
```
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST",
    credentials: true,
  })
);
```

However, I have not met a case where I need to specify the `resave` and `saveUnitialized` to be `true` in express-session. I will update again later when I do another project where I deal with more authentication and authorization. So, that's pretty much it of my learning authentication expression, I had so much ~~struggle~~ fun and see you guys in another project. Peace!
