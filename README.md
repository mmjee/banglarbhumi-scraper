### banglarbhumi-scraper

An extremely simple microservice that scrapes the [Banglarbhumi](https://banglarbhumi.gov.in) website for Plot information.

#### Why

Have you taken a look at the **absolute state** of the Banglarbhumi website? Looking at that makes me wonder how the people who built that didn't die of starvation because nobody would hire them.

It's extremely badly engineered, is **extremely** slow to load. Do a simple view source and realize the people who built this can't possibly exist, it must be built by an code generator.
It looks like dogshit, works like dogshit, is fragile and the API design it uses is so bad that it's better to scrape and parse the HTML directly. 

You may think it can't possibly get worse, but you are wrong. They implemented CAPTCHA, but how it works is they generate a random string **client side** (yes, there are people that are **this** dumb) and it is checked locally. Now, you may think that it must be converted to an image and I must have used an OCR to solve the captcha.

[If yes, you have too high expectations for NIC](https://github.com/mmjee/banglarbhumi-scraper/blob/005f0818ef2d9ffbcd9d8e7f9848075630f8a67c/bbs/getPlotInfo.js#L83). They store the fucking CAPTCHA in a normal fucking text input and anybody can just fucking see the data right there, it essentially does nothing. It isn't even fucking sent to the backend so they aren't even fucking using to protect against DDoS. I wonder why they made that? The administrators and the people who funded the project must be living in a false-assurance dreamland where their servers can't get DDoSed or scraped.

The only thing that it deters is the fucking users, people who did nothing wrong, it hurts nobody else. For something on this scale, they must have wasted years of human time solving CAPTCHAs. WHY?

If you are still not convinced just go checkout how the markup is structured and how they implemented the site. Everything looks like shit out of a time capsule from the early 2000s.

If you are someone like me and just want to get some data out for research or something every few days, just use this.

#### How to use (the actually important part)

```shell
cp docker-compose.example.yml docker-compose.yml
$EDITOR docker-compose.yml
# Add relevant AAAA records
yarn install
npx greenlock add --subject my-service.location.yourdomain.com --altnames my-service.location.yourdomain.com
docker-compose up -d
```

```text
POST /api/v1/get-plot-info

{
    "district": "District Name",
    "block": "Block Name",
    "mouza": "Mouza",

    "part1": "PLOT NO" # Plot No first field
    "part2": "PLOT NO" # Plot No second field
}
```

```json5
{
  plotDetails: { classification: 'শালি', totalArea: '42' },
  holders: [
    {
      khatianNo: '42',
      ownerName: 'একটা নাম',
      fatherOrHusband: 'আরেকটা নাম',
      share: '0.42',
      shareArea: '0.42',
      remarks: 'Nil'
    }
  ]
}
```

Please note the options are compared case-insensitively.

#### Fuck You (if you are not employed by the NIC, you can skip this)

How the fuck did you fuck up this hard? How is it even possible to fuck up this hard? Are you still employed? How are you still employed?

But regardless, FUCK YOU.
