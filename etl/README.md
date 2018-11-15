# Explorer ETL Service

## Development

1. Install dependencies: `yarn`
1. Copy and adjust the .env file: `cp .env.example .env`
1. Start a local ElasticSearch instance, e. g. using Docker Compose: `docker-compose up`
1. Start a local LCD client: `thorchaincli advanced rest-server --chain-id your-chain-id`
1. Start a local TX decoding server: `thorchaindebug tx-decoding-server`
1. Start the ETL Service: `yarn start`

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
