# Market

Приложение использует в качестве фреймворка Angular 10.2.3. Взаимодействует с «1С:Торговая площадка» через специальный сервис __market-service__, выступающий в качестве Backend-for-Frontend

## Окружения

Приложение может функционировать на DEV/REMOTE/STAGE/PROD окружениях (папка `environments`).

## Девелоперский сервер

Выполнить `npm run start` или `npm run start:remote` для запуска девелоперского сервера. Адрес: `https://{ВАШ_IP}:4200/`. Приложение автоматически перезагрузится при изменении исходного кода. По умолчанию, приложение взаимодействует с локально запущенным экзмепляром __market-service__ не напрямую, а посредством создания proxy-сервера, настройки которого хранятся в `proxy.conf.js` или `proxy-remote.conf.js`. В этом же файле можно сменить адрес взаимодействующего Backend-for-Frontend сервиса (раскоментировав некоторые строки).

## Сборка

Результатом сборки является папка с артефактами (HTMl, JS, CSS и тд файлами). Запускать сборку необходимо для каждого окружения. 

### Без использования Docker

Выполнить `npm run build:dev` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/dev`. 
Выполнить `npm run build:stage` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/stage`. 
Выполнить `npm run build:prod` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/prod`.
Выполнить `npm run build` для сборки проекта для всех окружений. Собранные артефакты будут храниться в папке `dist`. 

### С использованием Docker

Для выполнения такой сборки на ПК должен быть установлен Docker.  
Выполнить `npm run docker:build:dev` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/dev`. 
Выполнить `npm run docker:build:stage` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/stage`.  
Выполнить `npm run docker:build:prod` для сборки проекта для DEV окружения. Собранные артефакты будут храниться в папке `dist/prod`.  
Выполнить `npm run docker:build` для сборки проекта для всех окружений. Собранные артефакты будут храниться в папке `dist`. 

## Запуск unit тестов (TODO)

Выполнить `npm run test` для запуска unit тестов с использованием [Karma](https://karma-runner.github.io).

## Запуск end-to-end тестов (TODO)

Выполнить `npm run e2e` для запуска end-to-end тестов на локальном стенде с использованием [Protractor](http://www.protractortest.org/).  
Выполнить `npm run e2e:dev` для запуска end-to-end тестов на стенде в DEV окружении с использованием [Protractor](http://www.protractortest.org/).  
Выполнить `npm run e2e:stage` для запуска end-to-end тестов на стенде в STAGE окружении с использованием [Protractor](http://www.protractortest.org/).  
Выполнить `npm run e2e:prod` для запуска end-to-end тестов на стенде в PROD окружении с использованием [Protractor](http://www.protractortest.org/).  

## Полезные Docker команды (TODO)

`docker-compose up --build --force-recreate`  
`docker-compose build --no-cache`  
`docker run -it market_app /bin/sh`  
`docker images`  
`docker image rm ID --force`  
`docker cp a00c26bec94a:/usr/src/app/dist/. .`  
`docker run -it --rm market_app /bin/sh`  
`docker run --rm market_app npm run e2e`  
