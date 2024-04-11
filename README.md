# EzDealsHub
###### COMP229-403-Group2Project


run `npm install` in each directory (client, server), then run `npm run dev` from project root

Run this from root directory to handle the installs :)

    npm install && cd server && npm install && cd ../client && npm install

put the .env in ./server directory

## To deploy on Render

**Root Directory:**

    server
    
**Build Command:**

    cd ../client && npm install && npm run build

**Start Command:**

    npm install --production=false && npm run start
