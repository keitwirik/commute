# Commute
A javascript webapp to track busses and trains in Chicago

Requires some customizing apache virtualhost, mod_rewrite and mod_proxy_http

RewriteEngine On                                                                                             
RewriteRule ^/v/getroutes/((.*)?)$ /v/getroutes?key=SECRET_KEY [QSA,P,L]                      
RewriteRule ^/v/getdirections/((.*)?)$ /v/getdirections?key=SECRET_KEY [QSA,P,L]              
RewriteRule ^/v/getstops/((.*)?)$ /v/getstops?key=SECRET_KEY [QSA,P,L]                        
RewriteRule ^/v/getpredictions/((.*)?)$ /v/getpredictions?key=SECRET_KEY [QSA,P,L]            
RewriteRule ^/v/t/ttarrivals/((.*)?)$ /t/ttarrivals.aspx?key=SECRET_KEY [QSA,P,L]      

ProxyPassMatch ^/t/((.*)?)$ http://lapi.transitchicago.com/api/1.0/$1                                        
ProxyPassMatch ^/v/((.*)?)$ http://www.ctabustracker.com/bustime/api/v1/$1  
