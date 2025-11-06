# 🚀 DespachantePro API Proxy

Proxy intermediário para conectar o sistema hospedado no Hostinger com o Supabase,
evitando erros de CORS, DNS e TLS.

---

## ⚡ Deploy via Vercel

1. Vá até [https://vercel.com/new](https://vercel.com/new)
2. Escolha **Import Git Repository**
3. Selecione este repositório (`despachantepro-api`)
4. Root Directory: `/`
5. Framework Preset: **Other**
6. Node.js Version: **20.x**
7. Clique **Deploy**

Após o deploy, teste acessando:
```
https://SEU-PROJETO.vercel.app/api/proxy/rest/v1/
```
Se aparecer:
```json
{"error":"Invalid API key"}
```
✅ Está tudo certo!
