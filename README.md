# GitHub AI Tracker

This script will track the amount of repositories, involving AI, currently (daily) trending. Ironically, it uses AI to do so.

# Example

```
> npm run start
Getting repositories from GitHub...
Found 25 repositories.
Evaluating repositories...
Done! Here are the results:
Amount of AI: 14
Amount of non-AI: 11
```

# Running

1. Run `npm install`
2. Setup `OPENAI_API_KEY` in `.env`
3. Run `npm run start`
