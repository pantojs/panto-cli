/**
 * Copyright (C) 2016 pantojs.xyz
 * index.js
 *
 * changelog
 * 2016-06-21[17:47:56]:revised
 *
 * @author yanni4night@gmail.com
 * @version 1.0.0
 * @since 1.0.0
 */
'use strict';

const panto = require('../panto/');

panto.pick('**/*.{js,jsx}').pipe(panto.read()).end();

panto.build().then((...args) => console.log(...args), (err) => console.error(err));