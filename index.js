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
const path = require('path');
const fs = require('fs');

const pantoFile = path.join(process.cwd(), 'pantofile.js');

if (fs.existsSync(pantoFile) && fs.statSync(pantoFile).isFile()) {
    const pf = require(pantoFile);
    if (panto.util.isFunction(pf)) {
        pf(panto);
    }
} else {
    panto.log.warn(`No pantofile.js found`);
}

panto.build().then(() => {
    panto.watch();
}, (err) => console.error(err));