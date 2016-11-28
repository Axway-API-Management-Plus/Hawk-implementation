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


**Disable the SSL Hostname Verification**
- Click “Tasks > Manage Gateway Settings”
- Click “General”
- Make sure “SSL cert’s name must match …” is NOT checked

![alt text][Screenshot14]
[Screenshot14]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot14.png  "Screenshot14"  


**Declare a new “Inbound Security Policy”**
- Click “Tasks > Manage Gateway Settings”
- Drill down to “API Manager > Inbound Security Policies”
- Add the “Validate HAWK Credentials” policy

![alt text][Screenshot15]
[Screenshot15]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot15.png  "Screenshot15"  

**Create a test user in the “Local Users” repository**
- Drill down to “Users and groups > Users”
- Click ”Add” and define a username and a password 

![alt text][Screenshot16]
[Screenshot16]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot16.png  "Screenshot16"  

**Define a new KPS Collection**
- Drill down to “Key Property Store”
- Click “Add KPS Collection”
- Make sure the name and alias are set to “hawk”

![alt text][Screenshot17]
[Screenshot17]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot17.png  "Screenshot17" 

**Define a new KPS Table**
- Drill down to “Key Property Store > hawk”
- Right click “hawk” and select “Add Table...”

![alt text][Screenshot18]
[Screenshot18]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot18.png  "Screenshot18" 
 

**Generate a new Client ID / Client Secret**
- Open the API Manager Web Interface (port 8075)
- Drill Down to ”Client Registry > Applications”
- Click ”New Application”
- In the “Authentication” tab, generate a new client ID
- Write down the Client ID / Client Secret


## Usage
**Demo Scenario**
- HAWK Key distribution through OAuth
- HAWK Request Integrity
- HAWK Anti-Replay Protection
- HAWK Authentication in the API Manager


**HAWK Key distribution through Oauth**
- Open http://<apigateway>:8080/demo/ in Firefox
- Copy / Paste your client_id and client_secret
- Type the username and password of your test user
- Click “Request Token !”

![alt text][Screenshot19]
[Screenshot19]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot19.png  "Screenshot19" 

- The “HAWK Key” and “HAWK KeyID” should be filled automatically
- Press F12 to open firebug and show the OAuth response

![alt text][Screenshot20]
[Screenshot20]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot20.png  "Screenshot20" 

**HAWK Request Integrity**
- Click “Test HAWK !”
- Show the request “Authorization Header” in Firebug

![alt text][Screenshot21]
[Screenshot21]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot21.png  "Screenshot21" 

**HAWK Anti-Replay Protection**
- In Firebug, click “Edit and Resend”, and just send the request “as-is”

![alt text][Screenshot22]
[Screenshot22]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot22.png  "Screenshot22" 

- The request should fail because of the anti-replay protection

![alt text][Screenshot23]
[Screenshot23]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot23.png  "Screenshot23" 


**HAWK Authentication in the API Manager **
- Create a backend API
  * Drill down to “API Registration > Backend API”
  * Click “New API” and select ”New”
  * You can use the “/fake” API as backend

![alt text][Screenshot24]
[Screenshot24]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot24.png  "Screenshot24" 

  
- Create a Frontend API
  * Drill down to “API Registration > Frontend API”
  * Click “New API” and select ”New API from backend API”
  * In “inbound security”, choose “Invoke Policy” and select the “Validate HAWK Credentials”

![alt text][Screenshot25]
[Screenshot25]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot25.png  "Screenshot25" 
  
  - Just change the HAWK Resource URL in the demo web page to target the API Portal Traffic listener (8065)

![alt text][Screenshot26]
[Screenshot26]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot26.png  "Screenshot26" 

   
## Appendices

**Validate HAWK Credentials**

![alt text][Screenshot27]
[Screenshot27]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot27.png  "Screenshot27" 


**Persist HAWK Key**

![alt text][Screenshot28]
[Screenshot28]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot28.png  "Screenshot28" 

**HAWK-enabled Test Endpoint**


![alt text][Screenshot29]
[Screenshot29]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot29.png  "Screenshot29" 

**Add HAWK Key to OAuth2 Token Response**

![alt text][Screenshot30]
[Screenshot30]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot30.png  "Screenshot30" 


**Resource Owner Password Credentials**

![alt text][Screenshot31]
[Screenshot31]: https://github.com/Axway-API-Management/Hawk-implementation/blob/master/Screenshot31.png  "Screenshot31" 

  
   
## Bug and Caveats
Remaining Work:
- Implement Response Integrity
- Implement Time Synchronization


## Contributing

Please read [Contributing.md] (/Contributing.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Team

![alt text][Axwaylogo] Axway Team

[Axwaylogo]: https://github.com/Axway-API-Management/Common/blob/master/img/AxwayLogoSmall.png  "Axway logo"


## License
Apache License 2.0 (refer to document [license] (https://github.com/Axway-API-Management/Executing-loopback-requests-on-a-listener/blob/master/LICENSE))

