```mermaid
graph TB
    D["Devices/Sensors"]
    G["Gateways"]
    NS["Network Server"]
    BE["My Application"]
    AI["Appliction Server"]
    
    D --> G
    G --> NS
    NS --> BE
    BE --> AI

```