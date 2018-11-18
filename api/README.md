# Explorer API

## Development

1. Install dependencies: `yarn`
1. Copy and adjust the .env file: `cp .env.example .env`
1. Start a local ElasticSearch instance, e. g. using Docker Compose: `cd ../etl && docker-compose up && cd ../api`
1. Start the API: `yarn start`

### Debug

To attach your debugger, run: `yarn run debug`

### Access Kibana to debug data

http://localhost:5601

## Testing

`yarn test`

## Building for production

`yarn run build`

## Deployment

Requirements

* ElasticSearch
* Installed thorchaindebug
* Running thorchaincli
