## killed port 4000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force