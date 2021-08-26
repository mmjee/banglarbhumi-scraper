FROM node:lts

RUN apt-get install -y \
    fonts-liberation \
    gconf-service \
    libappindicator1 \
    libasound2 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libfontconfig1 \
    libgbm-dev \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libicu-dev \
    libjpeg-dev \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpng-dev \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
COPY index.js ./
COPY bbs ./bbs

COPY .greenlockrc ./
COPY greenlock.d ./greenlock.d

RUN yarn install
RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

# You may opt to init greenlock here.

EXPOSE 80
EXPOSE 443
ENV NODE_PATH=.
CMD ["node", "index.js"]
