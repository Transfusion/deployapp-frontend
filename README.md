# DeployApp Frontend

## Development

The frontend is a [Create React App](https://github.com/facebook/create-react-app) project that can be started independently; however, running it as part of [`deployapp-platform`](https://github.com/Transfusion/deployapp-platform#running-development) during development is **strongly recommended** due to various cross-origin / HSTS hurdles such as [this](https://stackoverflow.com/questions/47207364/safari-is-forcing-https-on-everything-when-i-dont-want-it-to) and [this](https://stackoverflow.com/questions/54225687/ajax-withcredentials-not-passing-along-cookies-in-safari).

## Production
The running instance at https://deploy.plan.ovh is built with the [`.prod.env`](https://github.com/Transfusion/deployapp-frontend/blob/master/environments/.prod.env) profile.

The K8s configuration files [are provided here](https://github.com/Transfusion/deployapp-platform/wiki/Deployment-to-K8S#frontend) for reference.
