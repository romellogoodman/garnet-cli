# garnet

> ⚠️⚠️⚠️
> This project is still in alpha mode
> ⚠️⚠️⚠️

[![npm version](https://badge.fury.io/js/garnet-cli.svg)](https://badge.fury.io/js/garnet-cli)

A development environment for creative coding with [p5.js](http://p5js.org/)

### Installation

Install the cli tool globally

```
$ npm i garnet-cli -g
```

Create a new js file for your sketch

```
$ touch sketch.js
```

Add some p5.js code

```
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
```

Run the sketch

```
$ garnet sketch.js
```
