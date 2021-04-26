## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Swagger UI
```
localhost:3000/docs
```

# Rebellion Test Backender

Hola Juan Castellano! This is the test. Good luck!

## Description

Create an application using [NestJS](https://docs.nestjs.com/)

You are going to do calls to an external API [Pokemon](https://pokeapi.co/api/v2/)

This application is going to run into a cluster so it could be good "dockerize" it.

### Find a Pokemon by name

Sample URL POST: SOME_URL/pokemon/findByName

{
        name: "PIKa chu"
}


Result sample:


```
{
   count: 2,
   results: [
         {
                base_experience: 112,
                name: 'pikachu',
                height: 4,
                weight: 60
         },
         ...
   ]

}

```

###

Sample URL GET: SOME_URL/pokemon/csv/:color

Returns a CSV file with a list of All Pokemons of a color order by base_experience

```
name;base_experience;height;weight
pikachu;112;4;60
...
```

## Final words

There is no right or wrong here, but whatever you come up with will be considered as an indicator towards your abilities to think on your own feet and how your personality might positively impact your code. Surprise us!

🤘 May the force be with you 🤘
