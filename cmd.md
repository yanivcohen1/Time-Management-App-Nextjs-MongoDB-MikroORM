## killed port 4000
- in win:
  -------
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force

- in linux:
  ---------
  fuser -k 4000/tcp