# Description
**A bit of history…**
- OAuth2 is the de-facto standard for authentication and session handling on mobile devices
- But it lacks (at least at its very beginning) a support for integrity & authenticity of messages

Refer to http://alexbilbie.com/2012/11/hawk-a-new-http-authentication-scheme/
And https://github.com/hueniverse/hawk

**Features provided by HAWK**
- Authentication of the Client
- Authentication of the Server
- Replay Protection
- Integrity of the request (URL + Body)

![alt text][Screenshot1]
[Screenshot1]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot1.png  "Screenshot1"   

**Relation to OAuth2**
- Hawk is not a replacement for OAuth2 !
- Hawk can be used with OAuth2
+ As a replacement for client_id, client_secret
+ As a complement of the access_token / refresh_token


## API Management Version Compatibilty
This artefact was successfully tested for the following versions:
- To be completed


## Install

Creation of Cache Flush Policy :

![alt text][Screenshot1]
[Screenshot1]: https://github.com/Axway-API-Management/API-Gateway-Flush-all-caches/blob/master/Screenshot1.png  "Screenshot1"   


## Usage

Some remarks about the policy : 
- First of all, make sure you selected the “Rhino engine JRE7 and earlier” option
- To get an instance of the EHcache’s CacheManager, the script has to get first an instance of a cache
- It uses the “Local maximum messages” (one of the default caches) 
- When used in production, it is safer to use a dedicated cache so that if default caches are removed, the scripts still works
- The script returns true, if caches have been flushed. False otherwise. Make sure to reflect this as HTTP Status code ! 
   

## Bug and Caveats

```
To be completed
```

## Contributing

Please read [Contributing.md] (/Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Team

![alt text][Axwaylogo] Axway Team

[Axwaylogo]: https://github.com/Axway-API-Management/Common/blob/master/img/AxwayLogoSmall.png  "Axway logo"


## License
Apache License 2.0 (refer to document [license] (https://github.com/Axway-API-Management/Executing-loopback-requests-on-a-listener/blob/master/LICENSE))

