---
title: Date Counter (format)
---

import RacingBars from '../racing-bars.js';

This example shows the use of date formatting in `dateCounter`

<!--truncate-->

### Chart

<div className="gallery">
  <RacingBars
    dataUrl="/data/population.csv"
    dataType="csv"
    dateCounter="MMM DD, YYYY 🌍"
  />
</div>

### Code

```html {5}
<div id="race"></div>
<script>
  const options = {
    selector: '#race',
    dateCounter: 'MMM DD, YYYY 🌍',
  };

  racingBars.loadData('/data/population.csv', 'csv').then((data) => {
    racingBars.race(data, options);
  });
</script>
```
