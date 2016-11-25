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
- Hawk can be used with OAuth2:
  * As a replacement for client_id, client_secret
  * As a complement of the access_token / refresh_token

  
**Sample integration between OAuth and HAWK**

![alt text][Screenshot2]
[Screenshot2]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot2.png  "Screenshot2"   
  

  
**Feature coverage by this [sample] implementation**
  
|HAWK Feature                                   | In this Sample Implementation ? |
|-----------------------------------------------|--------------------------------:|
|Request Integrity                              |Yes                              |
|Payload Integrity                              |Yes                              |
|Protection against Replay Attacks              |Yes                              |
|Response Integrity                             |No                               |
|Time Synchronization between client and server |No                               |
|Supported HMAC Algorithms                      |HMAC-SHA256                      |

 
 
 
## API Management Version Compatibilty
This artefact was successfully tested for the following versions:
- Axway API Gateway 7.4.2


## Install

**Pre-requisites**
- Axway API Gateway 7.4.2
  * With OAuth installed	
  * With API Manager installed
- Firefox 47.0
- Policy Studio
- SSH / SCP client (putty, …)

**Project Organization**

![alt text][Screenshot3]
[Screenshot3]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot3.png  "Screenshot3"   

**Install Overview**

![alt text][Screenshot4]
[Screenshot4]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot4.png  "Screenshot4"   

**Import Policies**
- Import “hawk-policies.xml” into your policy studio
- Import “oauth-policies.xml” into your policy studio

**Install the demo web page**
- Copy the demo folder to the apigateway installation folder
- Make sure the files and folder are readable by the apigateway user
- In the Listener > API Gateway > Default Services > Paths, add a new “Static Content Provider”

![alt text][Screenshot5]
[Screenshot5]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot5.png  "Screenshot5"   

**Make sure the imported policies are bound to a path (“Default Services” Listener)**

![alt text][Screenshot6]
[Screenshot6]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot6.png  "Screenshot6"   

**Make sure the Node Manager Admin Interface URL is correct**
- Open the “Persist HAWK Key” policy
- Open the “Route to Node Manager” Filter
- Make sure the URL is correct

![alt text][Screenshot7]
[Screenshot7]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot7.png  "Screenshot7"   

**Check the Node Manager Admin Credentials**
- Drill down to External Connections > Client Credentials > HTTP Basic
- Edit “Node Manager Admin” and make sure it matches your admin credentials 

![alt text][Screenshot8]
[Screenshot8]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot8.png  "Screenshot8"  

**Check the “HAWK Nonce” Cache**
- This cache is used to check if a nonce has already been used before. 
- For a PoC, the default settings are fine. But for production, you might want to setup a distributed cache with better idle/live settings

![alt text][Screenshot9]
[Screenshot9]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot9.png  "Screenshot9"  
 
**Setup the CORS Profile “CORS Anywhere” (1/2)**
- Drill down to “Libraries > CORS Profiles” and create a new profile

![alt text][Screenshot10]
[Screenshot10]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot10.png  "Screenshot10"  


**Setup the CORS Profile “CORS Anywhere” (2/2)**

![alt text][Screenshot11]
[Screenshot11]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot11.png  "Screenshot11"  

Note: The “Max. age” settings is important, otherwise the “Firebug” plugin of Firefox does not behave correctly.

**Bind the CORS Profile to the OAuth and Default Listeners**
- Drill down to Listeners > API Gateway > Default Services, click “Edit” and select ”CORS Anywhere”
- Drill down to Listeners > API Gateway > OAuth 2.0 Services, click “Edit” and select ”CORS Anywhere”

![alt text][Screenshot12]
[Screenshot12]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot12.png  "Screenshot12"  

Note: if you plan to use the demo interface with the API Manager, add the CORS Profile to the “API Manager Traffic” Listener too.

**Import the admin node manager certificate**
- Drill down to Certificates and Keys > Certificate and import both the Admin Node Manager certificate + its CA Certificate

![alt text][Screenshot13]
[Screenshot13]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot13.png  "Screenshot13"  




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

