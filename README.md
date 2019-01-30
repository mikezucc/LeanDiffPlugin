# LeanDiffPlugin for Chrome
Filter by component owners for your Phabricator differential

## Getting Started

1. Before adding to Chrome, in `manifest.json`, add your phabricator host names to the `matches` array with a __wildcard path__ : i.e. `https://phabricator.stackdiffs.com/D*`
2. Add this as an unpacked plugin to your Chrome
3. Go to a differential
4. Choose diff by owner

your `manifest.json` should contain a `matches` like

```json
 "content_scripts": [
       {
         "matches": ["https://phabricator.stackdiffs.com/D*"],
         "css": [],
         "js": ["contentScript.js"],
         "run_at": "document_idle",
         "all_frames": true
       }
     ]
```


## Why?

What to do about a huge diff huh? Don't want to incrementally break master by manually sharding? Find that stacked diffs are quite surgical and require developer-aware state transitions involving a few bash programs?

All the frustration boils down to:

> "I really don't have time or cognizance to safely review your diff of 100 files when my team was requested for 5 of them! I wish I could just see the 5 files that my team cares about, even though they are just header changes! I can barely find them amongst the dense UI! Now 30 seconds feels like 30 minutes!"

Well now just click the big blue button and filter by component owners.
