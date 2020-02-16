# TEST SITES

1. https://eddiegarside.com/ **test email** : alex@eddiegarside.com  
   **output** : email 1: eddiegarside@gmail.com / phone number 1: +0 (755) 736-7937
2. https://www.kompli-global.com/ **test email** : alex@kompli-global.com  
   **output** : No email address found / phone number 1: +44 (203) 199-7115
3. https://www.canddi.com/ **test email** : alex@canddi.com  
   **output** : email 1: hello@canddi.com / phone number 1: +0 (161) 414-1080
4. https://streetcarsmanchester.co.uk/ **test email** : alex@streetcarsmanchester.co.uk  
   **output** : No email address found / phone number 1: +0 (161) 228-7878
5. https://bruntwood.co.uk/ **test email** : alex@sbruntwood.co.uk  
   **output** : No email address found / phone number 1: +0 (800) 731-0300
6. https://www.meetmarcel.be/ **test email** : alex@meetmarcel.be  
   **output** : email 1: info@meetmarcel.be / phone number 1: +00 (325) 040-0040
7. https://www.gtncontractingservices.co.uk/ **test email** : alex@gtncontractingservices.co.uk  
   **output** : email 1: gtn@btconnect.com / phone number 1: +0 (161) 793-8175
8. https://www.masterliftconstruction.co.uk/ **test email** : alex@masterliftconstruction.co.uk  
   **output** : email 1: info@masterlc.co.uk / phone number 1: +0 (755) 736-1803
9. https://www.manchestercleaner.co.uk/ **test email** : alex@manchestercleaner.co.uk  
   **output** : No email address found / phone number 1: +0 (161) 823-0200
10. https://www.softwire.com/ **test email** : alex@manchestercleaner.co.uk  
   **output** : email 1: mail@example.tld / phone number 1: +0 (207) 485-7500
11. https://www.mclarengroup.com/ **test email** : alex@manchestercleaner.co.uk  
   **output** : No email address found / phone number 1: +0 (127) 720-5800
12. https://andywhittakerphotography.co.uk/ **test email** : alex@andywhittakerphotography.co.uk    
   **output** : email 1: info@andywhittakerphotography.co.uk / phone number 1: +0 (751) 575-9986
13. https://shanewebber.com/ **test email** : alex@shanewebber.com    
   **output** : email 1: hello@shanewebber.com / phone number 1: +0 (750) 087-2341
14. https://www.vilija-skubute.com/ **test email** : alex@vilija-skubute.com    
   **output** : email 1: vilija@vilija-skubute.com / phone number 1: +44 (744) 377-4319 
15. https://jonathanoakes.com/ **test email** : alex@jonathanoakes.com    
   **output** : No email address found / No phone numbers found 


### ERRORS I RAN INTO:

- https://www.everythingtech.co.uk/
name: 'RequestError',
message: 'Error: unable to verify the first certificate',
cause: Error: unable to verify the first certificate

- http://www.schofieldandsons.co.uk/
name: 'RequestError',
message: "Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames: Host: www.schofieldandsons.co.uk. is not in the cert's altnames: DNS:*.gridhost.co.uk, DNS:gridhost.co.uk"

- https://www.caringcarpenter.co.uk
name: 'RequestError',
message: 'Error: connect ETIMEDOUT 23.97.167.166:443',
cause: Error: connect ETIMEDOUT 23.97.167.166:443
