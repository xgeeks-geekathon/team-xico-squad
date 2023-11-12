# Geekathon AI Starter Template

## Files explaining the project

- IssueGenerator.pdf
- demo.mp4

### 1. Fork and Clone repo

Fork the repo to your Github account, then run the following command to clone the repo:

```
git clone git@github.com:xgeeks-geekathon/team-xico-squad.git
```

### 2. Run Install Script

```sh
cd team-xico-squad

# (SOS) make script executable: chmod +x run-install.sh
./run-install.sh
#
# script will:
## - install npm packages
## - create a .env file
```

### 3. Fill out secrets

You must update your .env.local file with the values for the following keys:

```
# OpenAI related environment variables
OPENAI_API_KEY=*

# Generate the following keys on Github. Go to Settings -> OAuth Apps -> New OAuth App
REACT_APP_CLIENT_ID=*
REACT_APP_CLIENT_SECRET=*

# You can use these keys as is:
NEXTAUTH_SECRET=drS0rzbFwi6FECAEbOpTXHGz2KGMZi02G5qLYfol2yo=
NEXTAUTH_URL="http://localhost:3001"
```

### For REACT_APP_CLIENT_ID and REACT_APP_CLIENT_SECRET keys

You can follow this guide https://medium.com/readytowork-org/implementing-oauth-2-0-in-the-next-13-app-using-next-auth-42226a26bc3 for more details.

<img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*W6s94tfVmwq9Ko_Vhootqg.png">

### 5. Run app locally

Now you are ready to test out the app locally! To do this, simply run `npm run dev` under the project root.

# IMPORTANT NOTES

## Functionality

If it fails on submit, please sign out and re-sign in every time you submit in order for things to work.
Hackathon MVP issues :d
