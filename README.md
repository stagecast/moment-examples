# Demos

This repository will contain a list of examples to help you develop your own Moments. In particular examples of how to: 
- Initialize 
- Use user and global state
- Create Mobile and Screen versions
- Use websockets
- Create configuration pages

## Moment Development (unofficial)

Currently we don't support an open development process, so consider this documentation as non official.

Steps to get started: 
- GET THE CONFIG DATA
    - Crete a Stagecast Account by going to https://stagecast.se
    - Create an Event and copy the event id you see in the launchpad
    - Via console: 
    ```
        STAGECAST_USER="<YOUR_USER_ID>" \
        STAGECAST_PWD="<YOUR_PASSWORD>" \
        EVENT_ID="<YOUR_EVENT_ID>"

        # login \
        curl --location --request POST 'https://stagecast.se/api/users/login' \
        --header 'Content-Type: application/json' \
        --data-raw "{
        \"email\": \"${STAGECAST_USER}\",
        \"password\": \"${STAGECAST_PWD}\"
        }" | python -m json.tool \
        | grep '\"token\"' \
        | cut -d ':' -f 2 
    ```
    - copy the token in a variable 
        `STAGECAST_TOKEN="token"`
    - run this command to create sandboxed event+momentclass+moment
    ```
        curl --location --request POST "https://stagecast.se/api/sandbox/${EVENT_ID}" \
        --header 'Content-Type: application/json' \
        --header "X-Token: ${STAGECAST_TOKEN}"
    ```
    - save the output for later use.
- Check `color-moment/adapters/tests/data.js` to see where to put all the variables together


## Content 

This folder contains:
- Color Moment: a simple standalone moment to get you started. The moment is in plain Javascript.
- Messaging Moment: a React.js based Moment that uses websockets and user states.


