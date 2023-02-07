# list-endpoints-express
lists endpoints that are registered in a express app
https://runkit.com/embed/jykefwvb1cht

## Usage

```javascript

var listEndpointsExpress = require("list-endpoints-express"),
express = require('express'),
someRouter = express.Router(),
app = express();

  someRouter.get('/v1', (req, res) => {
        res.send('OK');
  });

   someRouter.post('/v1', (req, res) => {
        res.send('OK');
  });

app.use('/about', someRouter);
app.use(['/help', '/:uriParam/help'], someRouter);
app.use(['/view', '/viewHelp', '/view/help'], someRouter);


console.log(JSON.stringify(listEndpointsExpress(app), null, 2));

```

## Arguments

### `app` - Express `app`

your app instance (`app`).

someRouter consists of routes to handle POST & GET using 'v1' context.

## Output

```JSON
[
  {
    "method": "GET",
    "paths": [
      "/about/v1",
      "/help/v1",
      "/:uriParam/help/v1",
      "/view/v1",
      "/viewHelp/v1",
      "/view/help/v1"
    ]
  },
  {
    "method": "POST",
    "paths": [
      "/about/v1",
      "/help/v1",
      "/:uriParam/help/v1",
      "/view/v1",
      "/viewHelp/v1",
      "/view/help/v1"
    ]
  }
]
  ```

## license

MIT
